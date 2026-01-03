/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				light: '#d4826a',
  				dark: '#a34829',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			serif: [
  				'Goudy Bookletter 1911"',
  				'Georgia',
  				'serif'
  			]
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: '65ch',
  					a: {
  						color: '#c45d3a',
  						textDecoration: 'none',
  						'&:hover': {
  							textDecoration: 'underline'
  						}
  					},
  					h1: {
  						fontFamily: 'Goudy Bookletter 1911", Georgia, serif'
  					},
  					h2: {
  						fontFamily: 'Goudy Bookletter 1911", Georgia, serif'
  					},
  					h3: {
  						fontFamily: 'Goudy Bookletter 1911", Georgia, serif'
  					}
  				}
  			},
  			invert: {
  				css: {
  					a: {
  						color: '#d4826a'
  					}
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
};
