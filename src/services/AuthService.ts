import { SupabaseService } from './SupabaseService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message: string;
}

export class AuthService {
  private static instance: AuthService;
  private supabaseService: SupabaseService;
  private currentUser: AuthUser = {
    id: 'usr-daizy-01',
    email: 'local@spanishlearn.offline',
    name: 'Daizy Shah',
    isGuest: true,
  };

  private constructor() {
    this.supabaseService = SupabaseService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getCurrentUser(): AuthUser {
    return { ...this.currentUser };
  }

  public isAuthenticatedCloudUser(): boolean {
    return !this.currentUser.isGuest;
  }

  /**
   * Registers a new learner via Supabase Authentication
   */
  public async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Introduce un correo electrónico válido.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const client = this.supabaseService.getClient();
    if (!client) {
      return {
        success: false,
        message: 'Supabase no está configurado en este entorno (.env). Sigues estudiando en modo local sin conexión.',
      };
    }

    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name: name.trim() || 'Estudiante' } },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      this.currentUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: name.trim() || 'Estudiante',
        isGuest: false,
      };
      return {
        success: true,
        user: this.getCurrentUser(),
        message: 'Cuenta creada. Revisa tu correo si se requiere confirmación.',
      };
    }

    return { success: false, message: 'No se pudo completar el registro.' };
  }

  /**
   * Signs in an existing learner via Supabase Authentication
   */
  public async signIn(email: string, password: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, message: 'Introduce correo y contraseña.' };
    }

    const client = this.supabaseService.getClient();
    if (!client) {
      return {
        success: false,
        message: 'Supabase no está configurado (.env). Modo sin conexión activo.',
      };
    }

    const { data, error } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.user) {
      const userName = (data.user.user_metadata?.name as string) || cleanEmail.split('@')[0];
      this.currentUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: userName,
        isGuest: false,
      };
      return {
        success: true,
        user: this.getCurrentUser(),
        message: `Sesión iniciada como ${this.currentUser.email}.`,
      };
    }

    return { success: false, message: 'Credenciales inválidas.' };
  }

  /**
   * Sends a passwordless Magic Link via Supabase Authentication
   */
  public async sendMagicLink(email: string): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Introduce un correo electrónico válido.' };
    }

    const client = this.supabaseService.getClient();
    if (!client) {
      return {
        success: false,
        message: 'Supabase no está configurado (.env). Enlace mágico no disponible en modo local.',
      };
    }

    const { error } = await client.auth.signInWithOtp({ email: cleanEmail });
    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: `Enlace mágico enviado a ${cleanEmail}.`,
    };
  }

  /**
   * Allows tests or manual cloud sessions to set authenticated context cleanly
   */
  public setActiveUser(user: AuthUser): void {
    this.currentUser = { ...user };
  }

  /**
   * Signs out of cloud session while keeping offline guest progress intact
   */
  public async signOut(): Promise<void> {
    const client = this.supabaseService.getClient();
    if (client) {
      await client.auth.signOut();
    }
    this.currentUser = {
      id: 'usr-daizy-01',
      email: 'local@spanishlearn.offline',
      name: 'Daizy Shah',
      isGuest: true,
    };
  }
}
