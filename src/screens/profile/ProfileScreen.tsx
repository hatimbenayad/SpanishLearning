import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Pressable,
  Share,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { PillButton } from '../../components/common/PillButton';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { UserProgress, CEFRLevel } from '../../types';
import { LearningService } from '../../services/LearningService';
import { SyncEngine } from '../../services/SyncEngine';
import { AuthService } from '../../services/AuthService';
import { SupabaseService } from '../../services/SupabaseService';
import { DatabaseService } from '../../services/DatabaseService';
import { grammarLessons } from '../../data/grammar';
import { readingLibrary } from '../../data/reading';

interface ProfileScreenProps {
  userProgress: UserProgress;
  onRefreshProgress?: () => void;
  onReopenOnboarding?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProgress,
  onRefreshProgress,
  onReopenOnboarding,
}) => {
  const learningService = LearningService.getInstance();
  const syncEngine = SyncEngine.getInstance();
  const authService = AuthService.getInstance();
  const supabaseService = SupabaseService.getInstance();
  const dbService = DatabaseService.getInstance();

  // Profile Preferences state
  const [editName, setEditName] = useState(userProgress.name);
  const [editLevel, setEditLevel] = useState<CEFRLevel>(userProgress.cefrLevel);
  const [editGoal, setEditGoal] = useState<number>(userProgress.dailyGoalMinutes);
  const [prefFeedback, setPrefFeedback] = useState<string | null>(null);

  // Per-user Supabase Settings state
  const savedSbConfig = supabaseService.getConfiguration();
  const [sbUrl, setSbUrl] = useState(savedSbConfig.url);
  const [sbKey, setSbKey] = useState('');
  const [sbConfigStatus, setSbConfigStatus] = useState<string | null>(null);
  const [sbTesting, setSbTesting] = useState(false);
  const [isSbConfigured, setIsSbConfigured] = useState(savedSbConfig.isConfigured);

  // Auth state
  const [authUser, setAuthUser] = useState(() => authService.getCurrentUser());
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Sync & Local Storage state
  const [syncStatus, setSyncStatus] = useState(() => syncEngine.getStatus());
  const [cacheStats, setCacheStats] = useState(() => dbService.getCacheStats());
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // JSON Backup state
  const [showJsonExport, setShowJsonExport] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSavePreferences = async () => {
    await learningService.updateProfilePreferences({
      name: editName,
      cefrLevel: editLevel,
      dailyGoalMinutes: editGoal,
    });
    setPrefFeedback('Preferencias guardadas localmente.');
    onRefreshProgress?.();
    setCacheStats(dbService.getCacheStats());
  };

  const handleSaveSupabaseConfig = async () => {
    const res = await supabaseService.configure(sbUrl, sbKey);
    setSbConfigStatus(res.message);
    if (res.success) {
      setIsSbConfigured(true);
      setSbKey('');
      setSyncStatus(syncEngine.getStatus());
    }
  };

  const handleTestSupabase = async () => {
    setSbTesting(true);
    const res = await supabaseService.testConnection();
    setSbConfigStatus(res.message);
    setSbTesting(false);
  };

  const handleClearSupabase = async () => {
    await supabaseService.clearConfiguration();
    await authService.signOut();
    setIsSbConfigured(false);
    setSbUrl('');
    setSbKey('');
    setAuthUser(authService.getCurrentUser());
    setSyncStatus(syncEngine.getStatus());
    setSbConfigStatus('Desconectado. Tus datos siguen funcionando 100% en modo local.');
  };

  const handleExport = () => {
    const json = learningService.exportBackupJSON();
    setExportedJson(json);
    setShowJsonExport(true);
    setStatusMessage('Copia de seguridad JSON generada con progreso, vocabulario y borradores.');
  };

  const handleShareJson = async () => {
    const json = learningService.exportBackupJSON();
    setExportedJson(json);
    setShowJsonExport(true);
    try {
      await Share.share({
        title: 'SpanishLearn-Backup.json',
        message: json,
      });
    } catch {
      setStatusMessage('Puedes copiar el JSON generado debajo para guardarlo en tu dispositivo.');
    }
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setStatusMessage('Pega primero el contenido JSON para importar.');
      return;
    }
    const result = learningService.importBackupJSON(importJsonText);
    setStatusMessage(result.message);
    if (result.success) {
      const updated = learningService.getProgress();
      setEditName(updated.name);
      setEditLevel(updated.cefrLevel);
      setEditGoal(updated.dailyGoalMinutes);
      onRefreshProgress?.();
      setImportJsonText('');
      setSyncStatus(syncEngine.getStatus());
      setCacheStats(dbService.getCacheStats());
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
    const res = await authService.signUp(authEmail, authPassword, editName);
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
    setAuthFeedback('Sesión cerrada. Sigues usando almacenamiento local.');
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
    setCacheStats(dbService.getCacheStats());
    setIsSyncing(false);
    if (result.success) {
      onRefreshProgress?.();
    }
  };

  const driverLabel =
    cacheStats.driver === 'expo-sqlite'
      ? 'SQLite nativo (dispositivo)'
      : cacheStats.driver === 'web-localstorage'
      ? 'Almacenamiento local (Web)'
      : 'Almacenamiento en memoria';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Perfil &amp; Configuración
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Almacenamiento local automático, tu propio Supabase y respaldo JSON
        </EditorialText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Summary Card */}
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
                {isSbConfigured && !authUser.isGuest
                  ? `Nube: ${authUser.email}`
                  : 'Modo 100% Local (sin cuenta requerida)'}
              </EditorialText>
              <View style={styles.userBadges}>
                <Badge label={`Nivel ${userProgress.cefrLevel}`} variant="forest" />
                <Badge label={`🔥 ${userProgress.currentStreak} días`} variant="orange" />
              </View>
            </View>
          </View>
        </EducationalCard>

        {/* Personal Preferences Editor */}
        <EducationalCard variant="ivory" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>🎯</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Preferencias de Estudio
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Personaliza tu nombre, nivel objetivo y meta diaria
              </EditorialText>
            </View>
          </View>

          {prefFeedback && (
            <View style={styles.statusBox}>
              <EditorialText variant="caption" color={colors.forestGreen}>
                {prefFeedback}
              </EditorialText>
            </View>
          )}

          <TextInput
            placeholder="Tu nombre"
            placeholderTextColor={colors.mutedGrey}
            value={editName}
            onChangeText={setEditName}
            style={styles.textInput}
          />

          <View style={styles.selectorBlock}>
            <EditorialText variant="caption" color={colors.text.secondary}>
              Nivel MCER actual:
            </EditorialText>
            <View style={styles.chipRow}>
              {(['A1', 'A2', 'B1', 'B2'] as const).map(lvl => (
                <Pressable
                  key={lvl}
                  onPress={() => setEditLevel(lvl)}
                  style={[styles.chip, editLevel === lvl && styles.chipActive]}
                >
                  <EditorialText
                    variant="caption"
                    color={editLevel === lvl ? colors.text.inverse : colors.text.primary}
                    style={{ fontWeight: '700' }}
                  >
                    {lvl}
                  </EditorialText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.selectorBlock}>
            <EditorialText variant="caption" color={colors.text.secondary}>
              Meta diaria:
            </EditorialText>
            <View style={styles.chipRow}>
              {[10, 20, 30].map(mins => (
                <Pressable
                  key={mins}
                  onPress={() => setEditGoal(mins)}
                  style={[styles.chip, editGoal === mins && styles.chipActive]}
                >
                  <EditorialText
                    variant="caption"
                    color={editGoal === mins ? colors.text.inverse : colors.text.primary}
                    style={{ fontWeight: '700' }}
                  >
                    {mins} min
                  </EditorialText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <PillButton
              title="Guardar preferencias"
              variant="secondary"
              onPress={handleSavePreferences}
              size="small"
            />
            {onReopenOnboarding && (
              <PillButton
                title="Ver bienvenida"
                variant="outline"
                onPress={onReopenOnboarding}
                size="small"
              />
            )}
          </View>
        </EducationalCard>

        {/* Per-User Custom Supabase Configuration */}
        <EducationalCard variant="cream" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>☁️</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Tu Servidor Supabase (Opcional)
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Si no lo configuras, todo se guarda automáticamente en tu dispositivo y en copias JSON.
              </EditorialText>
            </View>
            <Badge
              label={isSbConfigured ? 'Conectado' : 'Solo Local'}
              variant={isSbConfigured ? 'sage' : 'peach'}
            />
          </View>

          {sbConfigStatus && (
            <View style={styles.statusBox}>
              <EditorialText variant="caption" color={colors.forestGreen}>
                {sbConfigStatus}
              </EditorialText>
            </View>
          )}

          {isSbConfigured && (
            <View style={styles.cacheDetails}>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Proyecto activo: {supabaseService.getConfiguration().url}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Clave Anon: {supabaseService.getConfiguration().anonKeyMasked}
              </EditorialText>
            </View>
          )}

          <View style={styles.authForm}>
            <TextInput
              placeholder="Supabase URL (https://tu-proyecto.supabase.co)"
              placeholderTextColor={colors.mutedGrey}
              autoCapitalize="none"
              value={sbUrl}
              onChangeText={setSbUrl}
              style={styles.textInput}
            />
            <TextInput
              placeholder="Supabase Anon Key (eyJ...)"
              placeholderTextColor={colors.mutedGrey}
              autoCapitalize="none"
              secureTextEntry
              value={sbKey}
              onChangeText={setSbKey}
              style={styles.textInput}
            />
          </View>

          <View style={styles.actionButtonsRow}>
            <PillButton
              title="Guardar Supabase"
              variant="primary"
              onPress={handleSaveSupabaseConfig}
              size="small"
            />
            {isSbConfigured && (
              <>
                <PillButton
                  title="Probar conexión"
                  variant="secondary"
                  onPress={handleTestSupabase}
                  loading={sbTesting}
                  size="small"
                />
                <PillButton
                  title="Usar solo local"
                  variant="outline"
                  onPress={handleClearSupabase}
                  size="small"
                />
              </>
            )}
          </View>
        </EducationalCard>

        {/* Cloud Authentication (shown when user configures their Supabase) */}
        {isSbConfigured && (
          <EducationalCard variant="ivory" style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <EditorialText style={{ fontSize: 20 }}>🔐</EditorialText>
              <View style={{ flex: 1 }}>
                <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                  Cuenta en tu Supabase
                </EditorialText>
                <EditorialText variant="caption" color={colors.text.secondary}>
                  Inicia sesión o regístrate en tu propio proyecto Supabase
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
        )}

        {/* Offline Cache & Live Sync Status */}
        <EducationalCard variant="cream" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>📶</EditorialText>
            <View style={{ flex: 1 }}>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Almacenamiento Local &amp; Sincronización
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Motor activo: {driverLabel}
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
                Cambios por sincronizar:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.burntOrange} style={{ fontWeight: '700' }}>
                {syncStatus.pendingChangesCount} pendiente(s)
              </EditorialText>
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Borradores de escritura:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '600' }}>
                {learningService.getWritingDrafts().length} guardado(s)
              </EditorialText>
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Currículo disponible offline:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '600' }}>
                {grammarLessons.length} gramática • {readingLibrary.length} lecturas • {learningService.getVocabulary().length} palabras
              </EditorialText>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <PillButton
              title={isSbConfigured ? 'Sincronizar con Supabase' : 'Guardar cambios locales'}
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
                Portabilidad Total en JSON
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Exporta o restaura tu progreso, vocabulario y textos sin depender de servidores
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
              title="Generar respaldo JSON"
              variant="secondary"
              onPress={handleExport}
              size="small"
            />
            <PillButton
              title="Compartir / Guardar archivo"
              variant="outline"
              onPress={handleShareJson}
              size="small"
            />
          </View>

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

          <View style={styles.importBox}>
            <EditorialText variant="caption" color={colors.text.secondary} style={{ marginBottom: 6 }}>
              Restaurar desde copia JSON:
            </EditorialText>
            <TextInput
              multiline
              placeholder="Pega aquí el contenido de tu archivo JSON..."
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
  selectorBlock: {
    gap: 6,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  chipActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
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
