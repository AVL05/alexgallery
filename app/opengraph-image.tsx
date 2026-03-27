import { ImageResponse } from 'next/og'

export const alt = 'Alex Vicente | Profesional Photography'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '80px', 
            fontWeight: '900', 
            margin: 0, 
            textTransform: 'uppercase',
            letterSpacing: '-2px'
          }}>
            Alex Vicente
          </h1>
          <div style={{ 
            width: '80px', 
            height: '4px', 
            background: 'white', 
            marginTop: '20px',
            opacity: 0.5 
          }} />
          <p style={{ 
            fontSize: '24px', 
            marginTop: '30px', 
            textTransform: 'uppercase', 
            letterSpacing: '8px',
            opacity: 0.7
          }}>
            Portfolio Selection
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
