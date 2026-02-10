// hooks/useRouteProtection.ts
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppState } from '@/redux/store';

// Route configuration
const ROUTES = {
  PUBLIC: ['splash', '(auth)', 'onboarding'] as const,
  PROTECTED: ['(tabs)'] as const,
  DEFAULT_AUTHENTICATED: '/(tabs)' as const,
  DEFAULT_UNAUTHENTICATED: '/splash/get-started' as const,
} as const;

/**
 * Normalizes route segment by removing parentheses from route groups
 * Example: '(auth)' becomes 'auth', '(tabs)' becomes 'tabs'
 */
const normalizeSegment = (segment: string): string => {
  return segment.replace(/[()]/g, '');
};

/**
 * Checks if a segment matches any of the route patterns
 */
const matchesRoute = (segment: string | undefined, routes: readonly string[]): boolean => {
  if (!segment) return false;
  
  const normalized = normalizeSegment(segment);
  return routes.some(route => {
    const normalizedRoute = normalizeSegment(route);
    return normalized.startsWith(normalizedRoute);
  });
};

export function useRouteProtection(isReady: boolean) {
  const { isAuthenticated } = useAppState('auth');
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const currentSegment = segments[0];
    
    const isPublicRoute = matchesRoute(currentSegment, ROUTES.PUBLIC);
    const isProtectedRoute = matchesRoute(currentSegment, ROUTES.PROTECTED);

    // Redirect authenticated users away from auth pages
    if (isAuthenticated) {
    //   if (isPublicRoute && currentSegment !== 'splash' && currentSegment !== 'onboarding') {
    //     router.replace(ROUTES.DEFAULT_AUTHENTICATED);
    //   }
    } 
    // Redirect unauthenticated users to get-started
    else {
      if (isProtectedRoute || !currentSegment) {
        // router.replace(ROUTES.DEFAULT_UNAUTHENTICATED);
      }
    }
  }, [isAuthenticated, segments, isReady, router]);
}