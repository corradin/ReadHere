<script lang="ts">
  import { validateEmail } from '../lib/utils';

  interface Props {
    mode: 'login' | 'signup';
  }

  let { mode }: Props = $props();

  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let error = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = '';

    if (!validateEmail(email)) {
      error = 'Please enter a valid email address';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    isSubmitting = true;

    try {
      //TODO: Make auth call to supabase
      console.log('Signup attempt:', email);
      // window.location.href = '/';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Authentication failed';
    } finally {
      isSubmitting = false;
    }
  }

  const title = $derived(mode === 'login' ? 'Sign In' : 'Sign Up');
  const submitText = $derived(mode === 'login' ? 'Sign In' : 'Create Account');
</script>

<form class="auth-form" onsubmit={handleSubmit}>
  <h2>{title}</h2>

  <div class="form-group">
    <label for="email">Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="you@example.com"
      disabled={isSubmitting}
      required
    />
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      placeholder="••••••••"
      disabled={isSubmitting}
      required
    />
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button class="submit-button" disabled={isSubmitting}>
    {isSubmitting ? 'Please wait...' : submitText}
  </button>

  <p class="toggle-mode">
    {#if mode === 'login'}
      Don't have an account? <a href="/auth/signup">Sign up</a>
    {:else}
      Already have an account? <a href="/auth/login">Sign in</a>
    {/if}
  </p>
</form>

<style>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin: 0 0 24px 0;
    text-align: center;
    color: #1f2937;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  .error {
    color: #dc2626;
    font-size: 0.875rem;
    margin: 12px 0;
    text-align: center;
  }

  .submit-button {
    width: 100%;
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background: #2563eb;
  }

  .submit-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .toggle-mode {
    margin-top: 20px;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .toggle-mode a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .toggle-mode a:hover {
    text-decoration: underline;
  }
</style>
