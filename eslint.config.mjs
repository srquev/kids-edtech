import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
export default tseslint.config(
 {ignores:['dist/**','node_modules/**','.angular/**','playwright-report/**','test-results/**']},
 {files:['**/*.ts'],extends:[eslint.configs.recommended,...tseslint.configs.recommended,...angular.configs.tsRecommended],processor:angular.processInlineTemplates,rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],'@angular-eslint/prefer-inject':'off'}},
 {files:['**/*.html'],extends:[...angular.configs.templateRecommended,...angular.configs.templateAccessibility]}
);
