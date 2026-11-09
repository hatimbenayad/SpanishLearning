import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';
import { EditorialText } from '../../components/common/EditorialText';
import { EducationalCard } from '../../components/cards/EducationalCard';
import { PillButton } from '../../components/common/PillButton';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { UserProgress } from '../../types';
import { LearningService } from '../../services/LearningService';

interface ProfileScreenProps {
  userProgress: UserProgress;
  onRefreshProgress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProgress,
  onRefreshProgress,
}) => {
  const learningService = LearningService.getInstance();
  const [showJsonExport, setShowJsonExport] = useState(false);
  const [exportedJson, setExportedJson] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EditorialText variant="displaySmall" color={colors.text.primary}>
          Mi Perfil &amp; Datos
        </EditorialText>
        <EditorialText variant="caption" color={colors.text.secondary}>
          Configuración, portabilidad JSON y sincronización
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
                {userProgress.name}
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                Estudiando español de España (Castellano)
              </EditorialText>
              <View style={styles.userBadges}>
                <Badge label={`Nivel ${userProgress.cefrLevel}`} variant="forest" />
                <Badge label={`🔥 ${userProgress.currentStreak} días racha`} variant="orange" />
              </View>
            </View>
          </View>
        </EducationalCard>

        {/* Data Portability (JSON Import & Export) */}
        <EducationalCard variant="ivory" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>💾</EditorialText>
            <View>
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

        {/* Offline Cache Status */}
        <EducationalCard variant="cream" style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <EditorialText style={{ fontSize: 20 }}>📶</EditorialText>
            <View>
              <EditorialText variant="subheadline" color={colors.text.primary} style={{ fontWeight: '700' }}>
                Modo Fuera de Línea (Offline-First)
              </EditorialText>
              <EditorialText variant="caption" color={colors.text.secondary}>
                SQLite local sincronizado con Supabase
              </EditorialText>
            </View>
          </View>

          <View style={styles.cacheDetails}>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Estado de conexión:
              </EditorialText>
              <Badge label="En línea &amp; Sincronizado" variant="sage" />
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Lecciones descargadas:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '600' }}>
                24 lecciones (12.4 MB)
              </EditorialText>
            </View>
            <View style={styles.cacheRow}>
              <EditorialText variant="bodySmall" color={colors.text.primary}>
                Audios almacenados:
              </EditorialText>
              <EditorialText variant="bodySmall" color={colors.forestGreen} style={{ fontWeight: '600' }}>
                4 episodios (18.2 MB)
              </EditorialText>
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
  actionButtonsRow: {
    flexDirection: 'row',
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
  },
});
