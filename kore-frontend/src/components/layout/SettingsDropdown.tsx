'use client'

import { useState, useEffect, useRef } from 'react'

// Model options
const MODELS = [
  { id: 'gemini-2.5-flash', label: '2.5 Flash', description: 'Fast & Balanced', isDefault: true },
  { id: 'gemini-2.5-pro', label: '2.5 Pro', description: 'High Quality' },
  { id: 'gemini-3-flash-preview', label: '3.0 Flash', description: 'Latest Flash' },
  { id: 'gemini-3.1-pro-preview', label: '3.1 Pro', description: 'Most Advanced' },
]

// Temperature options
const TEMPERATURES = [
  { value: '0.4', label: 'Precise', description: 'Strict & focused' },
  { value: '0.5', label: 'Focused', description: 'Consistent output' },
  { value: '0.6', label: 'Balanced', description: 'Good middle ground' },
  { value: '0.7', label: 'Standard', description: 'Recommended', isDefault: true },
  { value: '0.8', label: 'Creative', description: 'More variation' },
]

// API Key options
const API_KEYS = [
  { id: null as string | null, label: 'Default', color: '#FFFFFF' },
  { id: (process.env.NEXT_PUBLIC_GEMINI_KEY_1 || null) as string | null, label: 'Leo', color: '#FF6B35' },
  { id: (process.env.NEXT_PUBLIC_GEMINI_KEY_2 || null) as string | null, label: 'Max', color: '#F7B801' },
  { id: (process.env.NEXT_PUBLIC_GEMINI_KEY_3 || null) as string | null, label: 'Sam', color: '#0496FF' },
  { id: (process.env.NEXT_PUBLIC_GEMINI_KEY_4 || null) as string | null, label: 'Alex', color: '#22C55E' },
  { id: (process.env.NEXT_PUBLIC_GEMINI_KEY_5 || null) as string | null, label: 'Jordan', color: '#A855F7' },
]

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash')
  const [selectedTemp, setSelectedTemp] = useState<string>('0.7')
  const [dropdownStyle, setDropdownStyle] = useState<{ maxHeight: string; top?: string; bottom?: string }>({ maxHeight: '400px' })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate optimal dropdown position and height based on viewport
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return

    const updatePosition = () => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      // Calculate optimal max height (leave 20px padding from viewport edges)
      const maxHeightBelow = spaceBelow - 28
      const maxHeightAbove = spaceAbove - 28

      // Prefer opening below, but open above if more space
      if (spaceBelow > 300 || spaceBelow > spaceAbove) {
        setDropdownStyle({
          maxHeight: `${Math.min(maxHeightBelow, 450)}px`,
          top: 'calc(100% + 4px)',
        })
      } else {
        setDropdownStyle({
          maxHeight: `${Math.min(maxHeightAbove, 450)}px`,
          bottom: 'calc(100% + 4px)',
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [isOpen])

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('currentGeminiApiKey')
    const savedModel = localStorage.getItem('selectedGeminiModel')
    const savedTemp = localStorage.getItem('selectedTemperature')
    
    if (savedKey) setSelectedApiKey(savedKey)
    if (savedModel) setSelectedModel(savedModel)
    if (savedTemp) setSelectedTemp(savedTemp)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setExpandedSection(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleApiKeyChange = (keyId: string | null) => {
    setSelectedApiKey(keyId)
    if (keyId) {
      localStorage.setItem('currentGeminiApiKey', keyId)
      console.log('[KORE] API Key switched to:', API_KEYS.find(k => k.id === keyId)?.label || 'Unknown')
    } else {
      localStorage.removeItem('currentGeminiApiKey')
      console.log('[KORE] API Key switched to: Default (using backend default)')
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    localStorage.setItem('selectedGeminiModel', modelId)
    console.log('[KORE] Model switched to:', modelId)
  }

  const handleTempChange = (temp: string) => {
    setSelectedTemp(temp)
    localStorage.setItem('selectedTemperature', temp)
    console.log('[KORE] Temperature switched to:', temp)
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Get current selections for display
  const currentApiKey = API_KEYS.find(k => k.id === selectedApiKey) || API_KEYS[0]
  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0]
  const currentTemp = TEMPERATURES.find(t => t.value === selectedTemp) || TEMPERATURES[3]

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Main Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0 10px',
          height: '100%',
          border: 'none',
          background: 'transparent',
          color: currentApiKey.color,
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.2px',
        }}
      >
        {/* AI Icon */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>{currentApiKey.label}</span>
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ 
            opacity: 0.6,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu - Black Theme */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          ...dropdownStyle,
          left: -8,
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)',
          minWidth: 240,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1000,
          animation: 'dropdownSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* API Keys Section */}
          <div style={{ borderBottom: '1px solid #2a2a2a' }}>
            <button
              onClick={() => toggleSection('apikey')}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>
                  API Key
                </div>
                <div style={{ fontSize: 12, color: currentApiKey.color, fontWeight: 600, letterSpacing: '-0.2px' }}>
                  {currentApiKey.label}
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'apikey' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'apikey' && (
              <div style={{ 
                paddingBottom: 6,
                animation: 'sectionExpand 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {API_KEYS.map((key) => (
                  <button
                    key={key.label}
                    onClick={() => {
                      handleApiKeyChange(key.id)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      background: selectedApiKey === key.id ? '#252525' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => {
                      if (selectedApiKey !== key.id) {
                        e.currentTarget.style.background = '#222'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedApiKey !== key.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: key.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 12,
                      color: selectedApiKey === key.id ? key.color : '#999',
                      fontWeight: selectedApiKey === key.id ? 600 : 400,
                      letterSpacing: '-0.2px',
                    }}>
                      {key.label}
                    </span>
                    {selectedApiKey === key.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={key.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model Section */}
          <div style={{ borderBottom: '1px solid #2a2a2a' }}>
            <button
              onClick={() => toggleSection('model')}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>
                  Model
                </div>
                <div style={{ fontSize: 12, color: '#e5e5e5', fontWeight: 600, letterSpacing: '-0.2px' }}>
                  {currentModel.label}
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'model' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'model' && (
              <div style={{ 
                paddingBottom: 6,
                animation: 'sectionExpand 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      handleModelChange(model.id)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      background: selectedModel === model.id ? '#252525' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => {
                      if (selectedModel !== model.id) {
                        e.currentTarget.style.background = '#222'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedModel !== model.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 12,
                        color: selectedModel === model.id ? '#e5e5e5' : '#999',
                        fontWeight: selectedModel === model.id ? 600 : 400,
                        letterSpacing: '-0.2px',
                      }}>
                        {model.label}
                      </span>
                      {selectedModel === model.id && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#555', marginTop: 1, letterSpacing: '-0.1px' }}>
                      {model.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Temperature Section */}
          <div>
            <button
              onClick={() => toggleSection('temperature')}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 3 }}>
                  Temperature
                </div>
                <div style={{ fontSize: 12, color: '#e5e5e5', fontWeight: 600, letterSpacing: '-0.2px' }}>
                  {currentTemp.label} ({currentTemp.value})
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'temperature' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'temperature' && (
              <div style={{ 
                paddingBottom: 6,
                animation: 'sectionExpand 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                {TEMPERATURES.map((temp) => (
                  <button
                    key={temp.value}
                    onClick={() => {
                      handleTempChange(temp.value)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      background: selectedTemp === temp.value ? '#252525' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => {
                      if (selectedTemp !== temp.value) {
                        e.currentTarget.style.background = '#222'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedTemp !== temp.value) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 12,
                        color: selectedTemp === temp.value ? '#e5e5e5' : '#999',
                        fontWeight: selectedTemp === temp.value ? 600 : 400,
                        letterSpacing: '-0.2px',
                      }}>
                        {temp.label}
                      </span>
                      <span style={{ fontSize: 10, color: '#555' }}>
                        ({temp.value})
                      </span>
                      {selectedTemp === temp.value && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#555', marginTop: 1, letterSpacing: '-0.1px' }}>
                      {temp.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sectionExpand {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 400px;
          }
        }

        /* Custom scrollbar - Dark theme */
        div::-webkit-scrollbar {
          width: 5px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  )
}
