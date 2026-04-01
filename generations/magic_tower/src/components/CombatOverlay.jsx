import React, { useEffect, useState } from 'react'

function CombatOverlay({ combat, onClose }) {
  // Early return if no combat data
  if (!combat) return null

  const [currentRound, setCurrentRound] = useState(0)
  const [playerHp, setPlayerHp] = useState(combat.playerMaxHp)
  const [monsterHp, setMonsterHp] = useState(combat.monsterMaxHp)
  const [showDamage, setShowDamage] = useState(null)

  useEffect(() => {
    let round = 0
    let pHp = combat.playerMaxHp
    let mHp = combat.monsterMaxHp

    const combatInterval = setInterval(() => {
      if (round >= combat.rounds.length) {
        clearInterval(combatInterval)
        // Auto-close after final round
        setTimeout(onClose, 1500)
        return
      }

      const roundData = combat.rounds[round]

      // Apply damage
      if (roundData.playerDamage) {
        mHp = Math.max(0, mHp - roundData.playerDamage)
      }
      if (roundData.monsterDamage) {
        pHp = Math.max(0, pHp - roundData.monsterDamage)
      }

      setPlayerHp(pHp)
      setMonsterHp(mHp)
      setShowDamage({
        playerDamage: roundData.playerDamage,
        monsterDamage: roundData.monsterDamage
      })
      setCurrentRound(round)

      // Clear damage numbers after a short delay
      setTimeout(() => setShowDamage(null), 800)

      round++
    }, 1200) // 1.2 seconds per round

    return () => clearInterval(combatInterval)
  }, [combat, onClose])

  const playerHpPercent = (playerHp / combat.playerMaxHp) * 100
  const monsterHpPercent = (monsterHp / combat.monsterMaxHp) * 100

  const getHpBarColor = (percent) => {
    if (percent >= 60) return '#44CC44'
    if (percent >= 30) return '#CCCC44'
    return '#CC4444'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes damagePopup {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-30px) scale(1.2);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          gap: '80px',
          alignItems: 'center',
          padding: '40px',
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          borderRadius: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
          minWidth: '600px'
        }}
      >
        {/* Player Side */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              fontSize: '72px',
              marginBottom: '10px',
              animation: showDamage?.monsterDamage ? 'shake 0.3s' : 'none'
            }}
          >
            🧙‍♂️
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4488FF',
              marginBottom: '15px'
            }}
          >
            Player
          </div>

          {/* Player Stats */}
          <div style={{ marginBottom: '15px', color: '#E5E5E5' }}>
            <div>ATK: {combat.playerAtk}</div>
            <div>DEF: {combat.playerDef}</div>
          </div>

          {/* Player HP Bar */}
          <div
            style={{
              width: '200px',
              height: '30px',
              backgroundColor: '#333',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid #555',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${playerHpPercent}%`,
                height: '100%',
                backgroundColor: getHpBarColor(playerHpPercent),
                transition: 'width 0.5s ease-out, background-color 0.5s ease-out'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {playerHp}/{combat.playerMaxHp}
            </div>
          </div>

          {/* Damage Taken */}
          {showDamage?.monsterDamage && (
            <div
              style={{
                position: 'absolute',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#FF4444',
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
                animation: 'damagePopup 0.8s ease-out forwards',
                marginTop: '-80px'
              }}
            >
              -{showDamage.monsterDamage}
            </div>
          )}
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}
        >
          VS
        </div>

        {/* Monster Side */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              fontSize: '72px',
              marginBottom: '10px',
              animation: showDamage?.playerDamage ? 'shake 0.3s' : 'none'
            }}
          >
            👹
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              marginBottom: '15px'
            }}
          >
            {combat.monsterName}
          </div>

          {/* Monster Stats */}
          <div style={{ marginBottom: '15px', color: '#E5E5E5' }}>
            <div>ATK: {combat.monsterAtk}</div>
            <div>DEF: {combat.monsterDef}</div>
          </div>

          {/* Monster HP Bar */}
          <div
            style={{
              width: '200px',
              height: '30px',
              backgroundColor: '#333',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid #555',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${monsterHpPercent}%`,
                height: '100%',
                backgroundColor: getHpBarColor(monsterHpPercent),
                transition: 'width 0.5s ease-out, background-color 0.5s ease-out'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '14px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {monsterHp}/{combat.monsterMaxHp}
            </div>
          </div>

          {/* Damage Taken */}
          {showDamage?.playerDamage && (
            <div
              style={{
                position: 'absolute',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#FFD700',
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
                animation: 'damagePopup 0.8s ease-out forwards',
                marginTop: '-80px'
              }}
            >
              -{showDamage.playerDamage}
            </div>
          )}
        </div>
      </div>

      {/* Round Counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '20px',
          color: '#AAA',
          fontWeight: 'bold'
        }}
      >
        Round {currentRound + 1} / {combat.rounds.length}
      </div>

      {/* Result */}
      {currentRound >= combat.rounds.length && (
        <div
          style={{
            position: 'absolute',
            top: '20%',
            fontSize: '64px',
            fontWeight: 'bold',
            color: playerHp > 0 ? '#44CC44' : '#CC4444',
            textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {playerHp > 0 ? 'VICTORY!' : 'DEFEAT!'}
        </div>
      )}
    </div>
  )
}

export default CombatOverlay
