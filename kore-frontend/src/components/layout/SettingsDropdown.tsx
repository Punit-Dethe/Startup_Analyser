'use client'

import { useState, useEffect, useRef } from 'react'

// Model options - UPDATE THIS LIST WITH YOUR NEW MODELS
const MODELS = [
  { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)', description: 'Fastest responses' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Balanced & stable', isDefault: true },
  { id: 'gemini-exp-1206', label: 'Gemini Experimental 1206', description: 'Latest features' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'High quality' },
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
  { id: null as string | null, label: 'Default (Backend)', color: '#000000' },
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
  const dropdownRef = useRef<HTMLDivElement>(null)

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
  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[1]
  const currentTemp = TEMPERATURES.find(t => t.value === selectedTemp) || TEMPERATURES[3]

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0 12px',
          height: '100%',
          border: 'none',
          background: 'transparent',
          color: currentApiKey.color,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.1px',
        }}
      >
        {/* AI Icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>{currentApiKey.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'white',
          border: '1px solid #E5E5E5',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: 320,
          maxHeight: '70vh',
          overflowY: 'auto',
          zIndex: 1000,
        }}>
          {/* API Keys Section */}
          <div style={{ borderBottom: '1px solid #E5E5E5' }}>
            <button
              onClick={() => toggleSection('apikey')}
              style={{
                width: '100%',
                padding: '12px 16px',
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
                <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  API Key
                </div>
                <div style={{ fontSize: 13, color: currentApiKey.color, fontWeight: 600 }}>
                  {currentApiKey.label}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'apikey' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'apikey' && (
              <div style={{ paddingBottom: 8 }}>
                {API_KEYS.map((key) => (
                  <button
                    key={key.label}
                    onClick={() => {
                      handleApiKeyChange(key.id)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: selectedApiKey === key.id ? '#F9FAFB' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (selectedApiKey !== key.id) {
                        e.currentTarget.style.background = '#F9FAFB'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedApiKey !== key.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: key.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 13,
                      color: selectedApiKey === key.id ? key.color : '#666',
                      fontWeight: selectedApiKey === key.id ? 600 : 400,
                    }}>
                      {key.label}
                    </span>
                    {selectedApiKey === key.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={key.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model Section */}
          <div style={{ borderBottom: '1px solid #E5E5E5' }}>
            <button
              onClick={() => toggleSection('model')}
              style={{
                width: '100%',
                padding: '12px 16px',
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
                <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  Model
                </div>
                <div style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>
                  {currentModel.label}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'model' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'model' && (
              <div style={{ paddingBottom: 8 }}>
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      handleModelChange(model.id)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: selectedModel === model.id ? '#F9FAFB' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (selectedModel !== model.id) {
                        e.currentTarget.style.background = '#F9FAFB'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedModel !== model.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 13,
                        color: selectedModel === model.id ? '#000' : '#666',
                        fontWeight: selectedModel === model.id ? 600 : 400,
                      }}>
                        {model.label}
                      </span>
                      {selectedModel === model.id && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
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
                padding: '12px 16px',
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
                <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  Temperature
                </div>
                <div style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>
                  {currentTemp.label} ({currentTemp.value})
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: expandedSection === 'temperature' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expandedSection === 'temperature' && (
              <div style={{ paddingBottom: 8 }}>
                {TEMPERATURES.map((temp) => (
                  <button
                    key={temp.value}
                    onClick={() => {
                      handleTempChange(temp.value)
                      setExpandedSection(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: selectedTemp === temp.value ? '#F9FAFB' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      if (selectedTemp !== temp.value) {
                        e.currentTarget.style.background = '#F9FAFB'
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedTemp !== temp.value) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 13,
                        color: selectedTemp === temp.value ? '#000' : '#666',
                        fontWeight: selectedTemp === temp.value ? 600 : 400,
                      }}>
                        {temp.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#999' }}>
                        ({temp.value})
                      </span>
                      {selectedTemp === temp.value && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                      {temp.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
