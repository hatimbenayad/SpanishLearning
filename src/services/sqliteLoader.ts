/**
 * Non-native fallback loader (Web and Node/Jest test environments use localStorage or memory fallback).
 */
export function loadExpoSQLite(): any {
  return null;
}

