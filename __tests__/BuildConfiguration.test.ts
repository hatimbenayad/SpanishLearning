import * as fs from 'fs';
import * as path from 'path';

describe('EAS Build & CI Configuration (Issue #5)', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('should define valid eas.json with development, preview, and production profiles', () => {
    const easPath = path.join(rootDir, 'eas.json');
    expect(fs.existsSync(easPath)).toBe(true);

    const eas = JSON.parse(fs.readFileSync(easPath, 'utf-8'));
    expect(eas.cli.version).toBeDefined();
    expect(eas.build.development.developmentClient).toBe(true);
    expect(eas.build.preview.android.buildType).toBe('apk');
    expect(eas.build.production.android.buildType).toBe('app-bundle');
    expect(eas.build.production.autoIncrement).toBe(true);
  });

  it('should configure app.json with iOS/Android identifiers, expo-sqlite plugin, and valid icon assets', () => {
    const appJsonPath = path.join(rootDir, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

    expect(appJson.expo.ios.bundleIdentifier).toBe('com.hatimbenayad.spanishlearn');
    expect(appJson.expo.android.package).toBe('com.hatimbenayad.spanishlearn');
    expect(appJson.expo.plugins).toContain('expo-sqlite');

    expect(fs.existsSync(path.join(rootDir, appJson.expo.icon))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, appJson.expo.android.adaptiveIcon.foregroundImage))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, appJson.expo.web.favicon))).toBe(true);
  });

  it('should provide .env.example and GitHub Actions CI workflow', () => {
    const envExamplePath = path.join(rootDir, '.env.example');
    const ciPath = path.join(rootDir, '.github/workflows/ci.yml');

    expect(fs.existsSync(envExamplePath)).toBe(true);
    expect(fs.existsSync(ciPath)).toBe(true);

    const envText = fs.readFileSync(envExamplePath, 'utf-8');
    expect(envText).toContain('EXPO_PUBLIC_SUPABASE_URL');
    expect(envText).toContain('EXPO_PUBLIC_SUPABASE_ANON_KEY');

    const ciText = fs.readFileSync(ciPath, 'utf-8');
    expect(ciText).toContain('npm run typecheck');
    expect(ciText).toContain('npm test');
    expect(ciText).toContain('expo config');
  });
});
