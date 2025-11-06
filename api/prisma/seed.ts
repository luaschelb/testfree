import prisma from '../db';

async function main() {
  const admin = await prisma.users.create({
    data: {
      name: 'Admin User',
      login: 'admin',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: 'ADMIN',
    },
  });

  const tester = await prisma.users.create({
    data: {
      name: 'QA Tester',
      login: 'qa',
      email: 'qa@example.com',
      password: 'hashedpassword',
      role: 'TESTER',
    },
  });

  const projects = await prisma.projects.createMany({
    data: [{
      name: 'E-commerce Platform',
      description: 'Main project for testing checkout and user flows',
      active: true,
    },{
      name: 'Projeto para edição teste automatizado',
      description: 'Projeto para edição teste automatizado',
      active: true,
    },{
      name: 'Projeto para deleção teste automatizado',
      description: 'Projeto para deleção teste automatizado',
      active: true,
    },]
  });

  const builds = await prisma.builds.createMany({
    data: [{
        title: 'Release Candidate',
        version: '1.0.0-rc',
        description: 'Release candidate build',
        active: true,
        project_id: 1,
      },{
        title: 'Release Next',
        version: '2.0.0-rc',
        description: 'Release Next build',
        active: true,
        project_id: 1,
      },{
        title: 'Release Delete',
        version: '2.0.0-rc',
        description: 'Release Delete build',
        active: true,
        project_id: 1,
      },
    ]}
  );

  const plan = await prisma.test_plans.create({
    data: {
      name: 'Smoke Test Plan',
      description: 'Covers critical smoke tests for release',
      active: true,
      project_id: 1,
    },
  });

  const scenario = await prisma.test_scenarios.create({
    data: {
      name: 'Checkout Flow',
      description: 'Covers login, cart, payment, and confirmation',
      order: 1,
      test_project_id: 1,
    },
  });

  const loginCase = await prisma.test_cases.create({
    data: {
      name: 'User can log in',
      description: 'Verify that a user can log in with valid credentials',
      steps: '1. Navigate to login\n2. Enter credentials\n3. Press login',
      enabled: true,
      can_edit: true,
      order: 1,
      test_scenario_id: scenario.id,
    },
  });

  const checkoutCase = await prisma.test_cases.create({
    data: {
      name: 'Checkout with valid credit card',
      description: 'Verify checkout completes successfully',
      steps: '1. Add item to cart\n2. Go to checkout\n3. Enter card\n4. Confirm',
      enabled: true,
      can_edit: true,
      order: 2,
      test_scenario_id: scenario.id,
    },
  });

  await prisma.test_steps.createMany({
    data: [
      {
        stepnumber: 1,
        action: 'Navigate to login page',
        expected_result: 'Login form is displayed',
        test_case_id: loginCase.id,
      },
      {
        stepnumber: 2,
        action: 'Enter valid username and password',
        expected_result: 'Form accepts input',
        test_case_id: loginCase.id,
      },
      {
        stepnumber: 3,
        action: 'Click login',
        expected_result: 'User is redirected to dashboard',
        test_case_id: loginCase.id,
      },
    ],
  });

  await prisma.testplans_testcases.createMany({
    data: [
      { test_plan_id: plan.id, test_case_id: loginCase.id },
      { test_plan_id: plan.id, test_case_id: checkoutCase.id },
    ],
  });

  const execution = await prisma.test_executions.create({
    data: {
      start_date: new Date(),
      title: "Exploratory testing",
      status: 1,
      comments: 'Initial smoke test run',
      test_plan_id: plan.id,
      build_id: 1,
    },
  });

  const execLoginCase = await prisma.test_executions_test_cases.create({
    data: {
      created_at: new Date(),
      passed: true,
      comment: 'Login worked fine',
      test_execution_id: execution.id,
      test_case_id: loginCase.id,
    },
  });

  const execCheckoutCase = await prisma.test_executions_test_cases.create({
    data: {
      created_at: new Date(),
      failed: true,
      comment: 'Payment gateway timeout',
      test_execution_id: execution.id,
      test_case_id: checkoutCase.id,
    },
  });

  await prisma.files.createMany({
    data: [
      {
        name: 'login_screenshot.png',
        path: '/screenshots/login.png',
        test_executions_test_cases_id: execLoginCase.id,
      },
      {
        name: 'checkout_error.png',
        path: '/screenshots/checkout.png',
        test_executions_test_cases_id: execCheckoutCase.id,
      },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });