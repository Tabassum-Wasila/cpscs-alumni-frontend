
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// CPSCS Alumni colors
				'cpscs-blue': '#0F3460',
				'cpscs-gold': '#FFD700',
				'cpscs-light': '#F5F5F7',
				'cpscs-dark': '#1A1F2C',
				'cpscs-green': '#587A33',
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'poppins': ['Poppins', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'gradient-x': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'scroll-left': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-33.333%)'
					}
				},
				
				// Enhanced smooth flowing animations for alumni cards
				'flow-left-smooth': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-33.333%)'
					}
				},
				
				'flow-right-smooth': {
					'0%': {
						transform: 'translateX(-33.333%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},

				// Premium card animations
				'card-glow': {
					'0%': {
						boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
					},
					'100%': {
						boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 40px hsl(var(--primary) / 0.1)'
					}
				},

				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},

        // Event-specific animations
        "gradient-flow": {
          "0%, 100%": { 
            backgroundPosition: "0% 50%",
            backgroundSize: "200% 200%"
          },
          "50%": { 
            backgroundPosition: "100% 50%",
            backgroundSize: "200% 200%"
          }
        },
        
        "title-glow": {
          "0%": { 
            textShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
          },
          "100%": { 
            textShadow: "0 0 30px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.4)"
          }
        },
        
        "float-horizontal": {
          "0%, 100%": { 
            transform: "translateX(-100px) translateY(0px)",
            opacity: "0"
          },
          "10%": { 
            opacity: "1"
          },
          "90%": { 
            opacity: "1"
          },
          "50%": { 
            transform: "translateX(calc(100vw + 100px)) translateY(-20px)"
          }
        },

        "glow": {
          "0%": {
            boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
          },
          "100%": {
            boxShadow: "0 0 30px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--primary) / 0.3)"
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.5s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
				'scroll-left': 'scroll-left 60s linear infinite',
				
				// Enhanced flowing animations for seamless circular motion
				'flow-left-smooth': 'flow-left-smooth 45s linear infinite',
				'flow-right-smooth': 'flow-right-smooth 50s linear infinite',
				
				// Premium card animations  
				'card-glow': 'card-glow 3s ease-in-out infinite alternate',
				'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
        
        // Event animations
        "gradient-flow": "gradient-flow 6s ease-in-out infinite",
        "title-glow": "title-glow 2s ease-in-out infinite alternate",
        "float-horizontal": "float-horizontal 8s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
