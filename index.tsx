<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Loopd - Life in sync</title>
    
    <!-- PWA Configuration -->
    <link rel="manifest" href="./manifest.json" />
    <meta name="theme-color" content="#E88D72" />
    
    <!-- iOS Specific PWA Settings -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Loopd" />
    <link rel="apple-touch-icon" href="https://placehold.co/192x192/E88D72/FFFFFF.png?text=L&font=nunito" />

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Nunito', 'sans-serif'],
            },
            colors: {
              loopd: {
                base: '#FAF9F6', // Off-white background
                primary: '#E88D72', // Warm terra cotta
                secondary: '#8FB9A8', // Sage green
                accent: '#F2D0A9', // Soft yellow/sand
                dark: '#4A4A4A', // Soft charcoal text
                light: '#FFFFFF',
                muted: '#9CA3AF',
                subtle: '#F3F4F6'
              }
            }
          }
        }
      }
    </script>
    <style>
      /* Hide scrollbar for clean UI */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      /* Smooth transitions */
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
      }
      .animate-slide-up {
        animation: slideUp 0.3s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    </style>
<script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.1",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.1/",
    "react/": "https://aistudiocdn.com/react@^19.2.1/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.31.0",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.555.0",
    "vite": "https://aistudiocdn.com/vite@^7.2.6",
    "@vitejs/plugin-react": "https://aistudiocdn.com/@vitejs/plugin-react@^5.1.1"
  }
}
</script>
</head>
  <body class="bg-loopd-base text-loopd-dark antialiased overflow-hidden fixed w-full h-full">
    <div id="root" class="h-full w-full"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>