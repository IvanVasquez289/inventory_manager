import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Docker - standalone output
  output: 'standalone',
  
  // Configuración para optimizar el build
  experimental: {
    // Optimizar imports de paquetes
    optimizePackageImports: ['@/components', '@/store'],
  },
  
  // Configuración para el manejo de imágenes
  images: {
    unoptimized: true,
  },
  
  // Configuración para el manejo de archivos estáticos
  trailingSlash: false,
  
  // Configuración para el manejo de errores
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Configuración para ignorar errores durante el build
  swcMinify: true,
  
  // Configuración para ser más permisivo con errores
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración para evitar problemas con páginas estáticas
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
