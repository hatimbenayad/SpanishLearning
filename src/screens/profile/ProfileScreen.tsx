import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { PillButton } from '../../components/common/PillButton';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { UserProgress } from '../../types';
import { LearningService } from '../../services/LearningService';
import { SyncEngine } from '../../services/SyncEngine';
import { AuthService } from '../../services/AuthService';
import { grammarLessons } from '../../data/grammar';
import { readingLibrary } from '../../data/reading';

interface ProfileScreenProps {
  userProgress: UserProgress;
  onRefreshProgress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProgress,
  onRefreshProgress,
}) => {
  const learningService = LearningService.getInstance();
  const syncEngine = SyncEngine.getInstance();
  const authService = AuthService.getInstance();

  const [showJsonExport, setShowJsonExport] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Auth & Cloud Sync UI state
  const [authUser, setAuthUser] = useState(() => authService.getCurrentUser());
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState(() => syncEngine.getStatus());
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleExport = () => {
    const json = learningService.exportBackupJSON();
    setExportedJson(json);
    setShowJsonExport(true);
    setStatusMessage('Copia de seguridad JSON generada correctamente.');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setStatusMessage('Pega primero el contenido JSON para importar.');
      return;
    }
    const result = learningService.importBackupJSON(importJsonText);
    setStatusMessage(result.message);
    if (result.success) {
      onRefreshProgress?.();
      setImportJsonText('');
      setSyncStatus(syncEngine.getStatus());
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    const res = await authService.signIn(authEmail, authPassword);
    setAuthFeedback(res.message);
    if (res.success && res.user) {
      setAuthUser(res.user);
      setAuthPassword('');
    }
    setAuthLoading(false);
  };

  const handleSignUp = async () => {
    setAuthLoading(true);
    const res = await authService.signUp(authEmail, authPassword, userProgress.name);
    setAuthFeedback(res.message);
    if (res.success && res.user) {
      setAuthUser(res.user);
      setAuthPassword('');
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setAuthUser(authService.getCurrentUser());
    setAuthFeedback('Sesión cerrada. Sigues usando el perfil local sin conexión.');
  };

  const handleToggleOfflineMode = () => {
    syncEngine.setOnlineStatus(!syncStatus.isOnline);
    setSyncStatus(syncEngine.getStatus());
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    const result = await syncEngine.synchronize();
    setSyncFeedback(result.message);
    setSyncStatus(syncEngine.getStatus());
    setIsSyncing(false);
    if (result.success) {
      onRefreshProgress?.();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Mi Perfil &amp; Datos
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Cuenta en la nube, sincronización SQLite y portabilidad JSON
        </EditorialText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <EducationalCard variant="cream" style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <EditorialText style={{ fontSize: 32 }}>👩🏻</EditorialText>
            </View>
            <View style={styles.userInfo}>
              <EditorialText variant="headline" color={colors.text.primary}>
                {authUser.isGuest ? userProgress.name : authUser.name}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                {authUser.isGuest
                  ? 'Modo local sin cuenta en la nube'
                  : `Conectado: ${authUser.email}`}
              </EditorialText>
              <View style={styles.userBadges}>
                <Badge label={`Nivel ${userProgress.cefrLevel}`} variant="forest" />
                <Badge label={`🔥 ${userProgress.currentStreak} días racha`} variant="orange" />
              </View>
            </View>
          </View>
        </EducationalCard>

        {/* Supabase Authentication Card */}
        <EducationalCard variant="ivory" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>🔐</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Cuenta Supabase &amp; Respaldo Cloud
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                {syncStatus.cloudConfigured
                  ? 'Proyecto Supabase configurado y listo'
                  : 'Modo offline local (configura .env para sincronización remota)'}
              </EditorialText>
            </View>
          </View>

          {authFeedback && (
            <View style={styles.statusBox}>
              <EditorialText variant="caption" color={colors.forestGreen}>
                {authFeedback}
              </EditorialText>
            </View>
          )}

          {authUser.isGuest ? (
            <View style={styles.authForm}>
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={colors.mutedGrey}
                autoCapitalize="none"
                keyboardType="email-address"
                value={authEmail}
                onChangeText={setAuthEmail}
                style={styles.textInput}
              />
              <TextInput
                placeholder="Contraseña (mín. 6 caracteres)"
                placeholderTextColor={colors.mutedGrey}
                secureTextEntry
                value={authPassword}
                onChangeText={setAuthPassword}
                style={styles.textInput}
              />
              <View style={styles.actionButtonsRow}>
                <PillButton
                  title="Iniciar sesión"
                  variant="secondary"
                  onPress={handleSignIn}
                  loading={authLoading}
                  size="small"
                />
                <PillButton
                  title="Crear cuenta"
                  variant="outline"
                  onPress={handleSignUp}
                  loading={authLoading}
                  size="small"
                />
              </View>
            </View>
          ) : (
            <View style={styles.actionButtonsRow}>
              <PillButton
                title="Cerrar sesión cloud"
                variant="outline"
                onPress={handleSignOut}
                size="small"
              />
            </View>
          )}
        </EducationalCard>

        {/* Offline Cache & Live Sync Status */}
        <EducationalCard variant="cream" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>📶</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Sincronización Offline-First (SQLite)
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Persistencia local con resolución de conflictos por marca temporal
              </EditorialText>
            </View>
          </View>

          {syncFeedback && (
            <View style={styles.statusBox}>
              <EditorialText variant="caption" color={colors.forestGreen}>
                {syncFeedback}
              </EditorialText>
            </View>
          )}

          <View style={styles.cacheDetails}>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Estado de red:
              </EditorialText>
              <Badge
                label={syncStatus.isOnline ? 'En línea' : 'Sin conexión'}
                variant={syncStatus.isOnline ? 'sage' : 'orange'}
              />
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Cambios pendientes en cola:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                {syncStatus.pendingChangesCount} pendiente(s)
              </EditorialText>
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Contenido disponible offline:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '600' }}>
                {grammarLessons.length} gramática • {readingLibrary.length} lecturas • {learningService.getVocabulary().length} palabras
              </EditorialText>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <PillButton
              title="Sincronizar ahora"
              variant="primary"
              onPress={handleSyncNow}
              loading={isSyncing}
              size="small"
            />
            <PillButton
              title={syncStatus.isOnline ? 'Simular offline' : 'Volver en línea'}
              variant="outline"
              onPress={handleToggleOfflineMode}
              size="small"
            />
          </View>
        </EducationalCard>

        {/* Data Portability (JSON Import & Export) */}
        <EducationalCard variant="ivory" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>💾</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Portabilidad de Datos (JSON)
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Exporta o restaura todo tu progreso sin perder datos
              </EditorialText>
            </View>
          </View>

          {statusMessage && (
            <View style={styles.statusBox}>
              <EditorialText variant="caption" color={colors.forestGreen}>
                {statusMessage}
              </EditorialText>
            </View>
          )}

          <View style={styles.actionButtonsRow}>
            <PillButton
              title="Exportar respaldo JSON"
              variant="secondary"
              onPress={handleExport}
              size="small"
            />
          </View>

          {/* Exported JSON Box */}
          {showJsonExport && (
            <View style={styles.jsonPreview}>
              <EditorialText variant="caption" color={colors.text.secondary} style={{ marginBottom: 4 }}>
                Respaldo JSON generado (versión 1.0.0):
              </EditorialText>
              <TextInput
                multiline
                editable={false}
                value={exportedJson}
                style={styles.jsonInput}
              />
            </View>
          )}

          {/* Import JSON Box */}
          <View style={styles.importBox}>
            <EditorialText variant="caption" color={colors.text.secondary} style={{ marginBottom: 6 }}>
              Restaurar desde JSON:
            </EditorialText>
            <TextInput
              multiline
              placeholder="Pega aquí el JSON de respaldo..."
              placeholderTextColor={colors.mutedGrey}
              value={importJsonText}
              onChangeText={setImportJsonText}
              style={[styles.jsonInput, { minHeight: 70 }]}
            />
            <View style={{ marginTop: 8 }}>
              <PillButton
                title="Restaurar datos"
                variant="dark"
                onPress={handleImport}
                size="small"
              />
            </View>
          </View>
        </EducationalCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.canvas,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
  userCard: {
    padding: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E5D8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2CEBA',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  sectionCard: {
    padding: 20,
    gap: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authForm: {
    gap: 10,
  },
  textInput: {
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusBox: {
    backgroundColor: '#E8F0EC',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.forestGreen,
  },
  jsonPreview: {
    marginTop: 8,
  },
  importBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  jsonInput: {
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 10,
    padding: 10,
    fontSize: 11,
    fontFamily: 'monospace',
    color: colors.text.primary,
    maxHeight: 140,
  },
  cacheDetails: {
    gap: 10,
    backgroundColor: 'rgba(23, 23, 21, 0.02)',
    padding: 14,
    borderRadius: 12,
  },
  cacheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});
