const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const tests = [
  '1_loginPageLoad.js',
  '2_fillLoginForm.js',
  '3_invalidLoginForm.js',
  '4_homePageCheck.js',
  '5_searchSong.js',
];

let passed = 0;
let failed = 0;

async function runTests() {
  console.log(chalk.cyan('\n🚀 Starting Spotify GUI Test Suite...\n'));

  const startSuite = Date.now();

  for (const test of tests) {
    const testPath = path.join(__dirname, 'tests', test);
    console.log(chalk.yellow(`🧪 Running: ${test}`));
    const startTime = Date.now();

    await new Promise((resolve) => {
      exec(`node "${testPath}"`, (err, stdout, stderr) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        if (err) {
          console.log(chalk.red(`❌ ${test} failed in ${duration}s`));
          console.error(chalk.gray(stderr.trim()));
          failed++;
        } else {
          console.log(chalk.green(`✅ ${test} passed in ${duration}s`));
          console.log(chalk.gray(stdout.trim()));
          passed++;
        }

        console.log(chalk.white('----------------------------------------\n'));
        resolve();
      });
    });
  }

  const totalDuration = ((Date.now() - startSuite) / 1000).toFixed(2);

  // Report Akhir
  console.log(chalk.cyan('\n📋 Test Summary'));
  console.log(chalk.cyan('=============================='));
  console.log(`🟢 Passed: ${chalk.green(passed)}`);
  console.log(`🔴 Failed: ${chalk.red(failed)}`);
  console.log(`⏱️ Total Duration: ${chalk.blue(`${totalDuration}s`)}`);
  console.log(chalk.cyan('==============================\n'));

  if (failed > 0) {
    console.log(chalk.red('❌ Some tests failed.\n'));
    process.exit(1);
  } else {
    console.log(chalk.green('✅ All tests passed successfully.\n'));
    process.exit(0);
  }
}

runTests();
