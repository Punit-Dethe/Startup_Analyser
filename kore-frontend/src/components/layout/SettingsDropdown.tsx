'use client'

import { useState, useEffect, useRef } from 'react'

// Model options
const MODELS = [
  { id: 'gemini-2.0-flash-exp', label: 'Fast & Efficient (2.0)', description: 'Fastest responses' },
  { id: 'gemini-2.5-flash', label: 'Balanced & Stable (2.5)', description: 'Recommended', isDefault: true },
  { id: 'gemini-exp-1206', label: 'Most Advanced (Exp)', description: 'Latest features' },
  { id: 'gemini-1.5-pro', label: 'High Quality (1.5 Pro)', description: 'Best quality' },
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
  { id: null, label: 'Default (Backend)', color: '#000000' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_1, label: 'Leo', color: '#FF6B35' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_2, label: 'Max', color: '#F7B801' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_3, label: 'Sam', color: '#0496FF' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_4, label: 'Alex', color: '#22C55E' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_5, label: 'Jordan', color: '#A855F7' },
]

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
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
          minWidth: 280,
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1000,
        }}>
          {/* API Keys Section */}
          <div style={{ padding: '12px 0' }}>
            <div style={{ padding: '0 16px 8px', fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              API Key
            </div>
            {API_KEYS.map((key) => (
              <button
                key={key.label}
                onClick={() => handleApiKeyChange(key.id)}
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

          <div style={{ height: 1, background: '#E5E5E5', margin: '8px 0' }} />

          {/* Model Section */}
          <div style={{ padding: '12px 0' }}>
            <div style={{ padding: '0 16px 8px', fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Model
            </div>
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
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
                  {model.isDefault && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background: '#22C55E',
                      color: 'white',
                      borderRadius: 3,
                      fontWeight: 600,
                    }}>
                      ⭐
                    </span>
                  )}
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

          <div style={{ height: 1, background: '#E5E5E5', margin: '8px 0' }} />

          {/* Temperature Section */}
          <div style={{ padding: '12px 0' }}>
            <div style={{ padding: '0 16px 8px', fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Temperature
            </div>
            {TEMPERATURES.map((temp) => (
              <button
                key={temp.value}
                onClick={() => handleTempChange(temp.value)}
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
                  {temp.isDefault && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background: '#22C55E',
                      color: 'white',
                      borderRadius: 3,
                      fontWeight: 600,
                    }}>
                      ⭐
                    </span>
                  )}
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
        </div>
      )}
    </div>
  )
}
