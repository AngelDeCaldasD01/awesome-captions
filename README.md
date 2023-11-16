This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

{
"printWidth": 80, // Ancho máximo de línea
"tabWidth": 2, // Tamaño de tabulación
"useTabs": false, // Utilizar espacios en lugar de tabulaciones
"semi": true, // Agregar punto y coma al final de las sentencias
"singleQuote": true, // Utilizar comillas simples en lugar de dobles
"jsxSingleQuote": true, // Utilizar comillas simples en el JSX
"trailingComma": "all", // Agregar comas finales en arrays y objetos
"bracketSpacing": true, // Espacios alrededor de los corchetes en objetos
"arrowParens": "always" // Incluir paréntesis alrededor de los argumentos de funciones flecha
}

// Las variables de entorno no se comunican bien cuando un componente está en modo cliente, es decir cuando has utilizado 'use client'
