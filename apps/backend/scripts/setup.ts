import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { default as fs } from 'node:fs';
import os from 'node:os';
import { default as path } from 'node:path';

import { cancel, intro, outro, select, spinner, text } from '@clack/prompts';

type CommandError = {
  stdout?: string;
  stderr?: string;
};

// Function to get current working directory
function getCurrentDirectory(): string {
  return execSync('pwd', { encoding: 'utf8' }).trim();
}

// Function to execute shell commands
function executeCommand(
  command: string,
): string | { error: true; message: string } {
  console.log(`\u001B[33m${command}\u001B[0m`);
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    const err = error as CommandError;
    return {
      error: true,
      message: err.stdout ?? err.stderr ?? 'Unknown error',
    };
  }
}

// Function to prompt user for input without readline-sync
async function prompt(message: string, defaultValue: string): Promise<string> {
  return (await text({
    defaultValue,
    message: `${message} (${defaultValue}):`,
    placeholder: defaultValue,
  })) as string;
}

// Function to extract account IDs from `wrangler whoami` output
function extractAccountDetails(output: string): { name: string; id: string }[] {
  const lines = output.split('\n');
  const accountDetails: { name: string; id: string }[] = [];

  for (const line of lines) {
    const isValidLine =
      line.trim().startsWith('│ ') && line.trim().endsWith(' │');

    if (isValidLine) {
      const regex = /\b[a-f0-9]{32}\b/g;
      const matches = line.match(regex);

      if (matches && matches.length === 1) {
        const accountName = line.split('│ ')[1]?.trim();
        const accountId = matches[0].replace('│ ', '').replace(' │', '');
        if (accountName === undefined || accountId === undefined) {
          console.error(
            '\u001B[31mError extracting account details from wrangler whoami output.\u001B[0m',
          );
          cancel('Operation cancelled.');
          throw new Error('Failed to extract account details');
        }
        accountDetails.push({ id: accountId, name: accountName });
      }
    }
  }

  return accountDetails;
}

// Function to prompt for account ID if there are multiple accounts
async function promptForAccountId(
  accounts: { name: string; id: string }[],
): Promise<string> {
  if (accounts.length === 1) {
    if (!accounts[0]) {
      console.error(
        '\u001B[31mNo accounts found. Please run `wrangler login`.\u001B[0m',
      );
      cancel('Operation cancelled.');
      throw new Error('No accounts found');
    }
    if (!accounts[0].id) {
      console.error(
        '\u001B[31mNo accounts found. Please run `wrangler login`.\u001B[0m',
      );
      cancel('Operation cancelled.');
      throw new Error('No account ID found');
    }
    return accounts[0].id;
  }

  if (accounts.length > 1) {
    const options = accounts.map((account) => ({
      label: account.name,
      value: account.id,
    }));
    const selectedAccountId = await select({
      message: 'Select an account to use:',
      options,
    });

    if (!selectedAccountId) {
      throw new Error('No account selected');
    }

    return selectedAccountId as string;
  }

  console.error(
    '\u001B[31mNo accounts found. Please run `wrangler login`.\u001B[0m',
  );
  cancel('Operation cancelled.');
  throw new Error('No accounts found');
}

let dbName: string;

type WranglerConfig = {
  name?: string;
  main?: string;
  compatibility_date?: string;
  compatibility_flags?: string[];
  d1_databases?: {
    binding: string;
    database_name: string;
    database_id: string;
    migrations_dir: string;
  }[];
};

// Function to create database and update wrangler.json
async function createDatabaseAndConfigure() {
  intro(`Let's set up your database...`);
  const defaultDBName = `${path.basename(getCurrentDirectory())}-db`;
  dbName = await prompt('Enter the name of your database', defaultDBName);

  let databaseID: string | undefined;

  const wranglerJsoncPath = path.join(
    import.meta.dirname,
    '..',
    'wrangler.json',
  );
  let wranglerConfig: WranglerConfig;

  try {
    const wranglerJsoncContent = fs.readFileSync(wranglerJsoncPath, 'utf8');
    wranglerConfig = JSON.parse(wranglerJsoncContent);
  } catch (error) {
    console.error('\u001B[31mError reading wrangler.json:', error, '\u001B[0m');
    cancel('Operation cancelled.');
    throw error;
  }

  // Run command to create a new database
  const creationOutput = executeCommand(`bunx wrangler d1 create ${dbName}`);

  if (creationOutput === undefined || typeof creationOutput !== 'string') {
    console.log(
      "\u001B[33mDatabase creation failed, maybe you have already created a database with that name. I'll try to find the database ID for you.\u001B[0m",
    );
    const dbInfoOutput = executeCommand(`bunx wrangler d1 info ${dbName}`);
    if (typeof dbInfoOutput === 'string') {
      const getInfo =
        /│ [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12} │/i.exec(
          dbInfoOutput,
        );
      if (getInfo && getInfo.length === 1) {
        console.log(
          '\u001B[33mFound it! The database ID is:',
          getInfo[0],
          '\u001B[0m',
        );
        databaseID = getInfo[0].replace('│ ', '').replace(' │', '');
      }
    }

    if (!databaseID) {
      console.error(
        '\u001B[31mSomething went wrong when initializing the database. Please try again.\u001B[0m',
      );
      cancel('Operation cancelled.');
      throw new Error('Failed to get database ID');
    }
  } else {
    // Extract database ID from the output
    const matchResult = /database_id = "(.*)"/.exec(creationOutput);
    if (matchResult?.[1]) {
      databaseID = matchResult[1];
    } else {
      console.error('Failed to extract database ID from the output.');
      cancel('Operation cancelled.');
      throw new Error('Failed to extract database ID');
    }
  }

  // Update wrangler.json with database configuration
  wranglerConfig.d1_databases = [
    {
      binding: 'DATABASE',
      database_id: databaseID,
      database_name: dbName,
      migrations_dir: './drizzle',
    },
  ];

  try {
    const updatedJsonc = JSON.stringify(wranglerConfig, null, 2);
    fs.writeFileSync(wranglerJsoncPath, updatedJsonc);
    console.log(
      '\u001B[33mDatabase configuration updated in wrangler.json\u001B[0m',
    );
  } catch (error) {
    console.error(
      '\u001B[31mError updating wrangler.json:',
      error,
      '\u001B[0m',
    );
    cancel('Operation cancelled.');
    throw error;
  }

  outro('Database configuration completed.');
}

// Function to prompt for environment variables
async function promptForEnvVars() {
  intro('Setting up environment variables...');

  const devVarsPath = path.join(import.meta.dirname, '..', '.dev.vars');
  // const devVarsExamplePath = path.join(
  //   import.meta.dirname,
  //   '..',
  //   '.dev.vars.example',
  // );

  if (fs.existsSync(devVarsPath)) {
    console.log(
      '\u001B[31m.dev.vars file already exists. Skipping creation.\u001B[0m',
    );
  } else {
    console.log(
      "\u001B[33mNow, let's set up your environment variables.\u001B[0m",
    );

    const vars = {
      AUTH_GITHUB_ID: await prompt(
        'Enter your GitHub Client ID (enter to skip)',
        '',
      ),
      AUTH_GITHUB_SECRET: await prompt(
        'Enter your GitHub Client Secret (enter to skip)',
        '',
      ),
      BETTER_AUTH_URL: await prompt(
        'Enter your Better Auth URL',
        'http://localhost:8787',
      ),
      LEMONSQUEEZY_CHECKOUT_LINK: await prompt(
        'Enter your Lemonsqueezy Checkout Link (enter to skip)',
        '',
      ),
      SECRET: generateSecureRandomString(32),
    };

    try {
      const envContent = Object.entries(vars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      fs.writeFileSync(devVarsPath, `${envContent}\n`);
      console.log(
        '\u001B[33m.dev.vars file created with environment variables.\u001B[0m',
      );
    } catch (error) {
      console.error(
        '\u001B[31mError creating .dev.vars file:',
        error,
        '\u001B[0m',
      );
      cancel('Operation cancelled.');
      throw error;
    }
  }

  outro('Environment variables setup completed.');
}

// Function to generate secure random string
function generateSecureRandomString(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

// Function to run database migrations
function runDatabaseMigrations(dbName: string) {
  const setupMigrationSpinner = spinner();
  setupMigrationSpinner.start('Generating setup migration...');
  executeCommand('bunx drizzle-kit generate --name setup');
  setupMigrationSpinner.stop('Setup migration generated.');

  const localMigrationSpinner = spinner();
  localMigrationSpinner.start('Running local database migrations...');
  executeCommand(`bunx wrangler d1 migrations apply ${dbName}`);
  localMigrationSpinner.stop('Local database migrations completed.');

  const remoteMigrationSpinner = spinner();
  remoteMigrationSpinner.start('Running remote database migrations...');
  executeCommand(`bunx wrangler d1 migrations apply ${dbName} --remote`);
  remoteMigrationSpinner.stop('Remote database migrations completed.');
}

// Function to deploy worker
async function deployWorker() {
  const shouldDeploy = await select({
    message: 'Would you like to deploy the worker now?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  });

  if (shouldDeploy === 'yes') {
    console.log('\u001B[33mDeploying worker...\u001B[0m');
    executeCommand('bunx wrangler deploy');
    console.log('\u001B[32mWorker deployed successfully!\u001B[0m');
  }
}

function setEnvironmentVariable(name: string, value: string): never {
  const platform = os.platform();
  const command =
    platform === 'win32'
      ? `set ${name}=${value}` // Windows Command Prompt
      : `export ${name}=${value}`; // Unix-like shells

  console.log(
    `\u001B[33mPlease run this command: ${command} and then rerun the setup script.\u001B[0m`,
  );
  throw new Error('Environment variable needs to be set');
}

async function main() {
  try {
    const whoamiOutput = executeCommand('wrangler whoami');
    if (whoamiOutput === undefined || typeof whoamiOutput !== 'string') {
      console.error(
        '\u001B[31mError running wrangler whoami. Please run `wrangler login`.\u001B[0m',
      );
      cancel('Operation cancelled.');
      throw new Error('Failed to run wrangler whoami');
    }

    try {
      await createDatabaseAndConfigure();
    } catch (error) {
      console.error('\u001B[31mError:', error, '\u001B[0m');
      const accountIds = extractAccountDetails(whoamiOutput);
      const accountId = await promptForAccountId(accountIds);
      setEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID', accountId);
    }

    await promptForEnvVars();
    runDatabaseMigrations(dbName);
    await deployWorker();

    console.log('\u001B[32mSetup completed successfully!\u001B[0m');
    console.log(
      "\u001B[33mYou can now run 'bun run dev' to start the development server.\u001B[0m",
    );
  } catch (error) {
    console.error('\u001B[31mError:', error, '\u001B[0m');
    cancel('Operation cancelled.');
    throw error;
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(() => {
  // Exit with error code
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
