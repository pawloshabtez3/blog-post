#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * 
 * This script verifies that all required environment variables are set
 * and have valid values before deployment.
 * 
 * Usage: node scripts/verify-env.js
 */

const requiredEnvVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    validation: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    example: 'https://your-project-ref.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    validation: (value) => value.length > 100 && value.startsWith('eyJ'),
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    description: 'Site URL for redirects and OAuth',
    validation: (value) => value.startsWith('http://') || value.startsWith('https://'),
    example: 'https://yourdomain.com'
  },
  {
    name: 'GEMINI_API_KEY',
    description: 'Google Gemini API key',
    validation: (value) => value.length > 20,
    example: 'AIzaSy...'
  }
];

const optionalEnvVars = [
  {
    name: 'SENTRY_DSN',
    description: 'Sentry error tracking DSN (optional)'
  },
  {
    name: 'NEXT_PUBLIC_GA_ID',
    description: 'Google Analytics ID (optional)'
  }
];

console.log('🔍 Verifying Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 Required Variables:');
console.log('─'.repeat(60));

requiredEnvVars.forEach(({ name, description, validation, example }) => {
  const value = process.env[name];
  
  if (!value) {
    console.log(`❌ ${name}`);
    console.log(`   Missing: ${description}`);
    console.log(`   Example: ${example}\n`);
    hasErrors = true;
  } else if (value === 'your_gemini_api_key' || value.includes('your-') || value.includes('your_')) {
    console.log(`⚠️  ${name}`);
    console.log(`   Placeholder value detected: ${description}`);
    console.log(`   Please replace with actual value\n`);
    hasErrors = true;
  } else if (validation && !validation(value)) {
    console.log(`⚠️  ${name}`);
    console.log(`   Invalid format: ${description}`);
    console.log(`   Expected format: ${example}\n`);
    hasWarnings = true;
  } else {
    const maskedValue = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
      : `${value.substring(0, 5)}...`;
    console.log(`✅ ${name}`);
    console.log(`   Value: ${maskedValue}\n`);
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
console.log('─'.repeat(60));

optionalEnvVars.forEach(({ name, description }) => {
  const value = process.env[name];
  
  if (!value) {
    console.log(`ℹ️  ${name}`);
    console.log(`   Not set: ${description}\n`);
  } else {
    const maskedValue = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
      : `${value.substring(0, 5)}...`;
    console.log(`✅ ${name}`);
    console.log(`   Value: ${maskedValue}\n`);
  }
});

// Environment-specific checks
console.log('\n🌍 Environment Checks:');
console.log('─'.repeat(60));

const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Environment: ${nodeEnv}`);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (siteUrl) {
  if (nodeEnv === 'production' && siteUrl.includes('localhost')) {
    console.log('⚠️  Warning: Production environment using localhost URL');
    hasWarnings = true;
  } else if (nodeEnv === 'production' && !siteUrl.startsWith('https://')) {
    console.log('⚠️  Warning: Production environment should use HTTPS');
    hasWarnings = true;
  } else {
    console.log('✅ Site URL matches environment');
  }
}

// Summary
console.log('\n' + '═'.repeat(60));
console.log('📊 Summary:');
console.log('═'.repeat(60));

if (hasErrors) {
  console.log('❌ Verification FAILED');
  console.log('   Please fix the errors above before deploying.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Verification completed with WARNINGS');
  console.log('   Review the warnings above before deploying.\n');
  process.exit(0);
} else {
  console.log('✅ All environment variables are properly configured!');
  console.log('   Ready for deployment.\n');
  process.exit(0);
}
