'use client';

import Image from 'next/image'; // Assuming next/image is used for the Image component

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] font-sans text-[var(--color-text-main)]">
      {/* ===== ヘッダーナビゲーション（固定・半透明） ===== */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid var(--color-bg-base)',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* ロゴ */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)', fontFamily: '"Zen Maru Gothic", sans-serif' }}>FLATUP</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-text-main)', fontFamily: '"Zen Maru Gothic", sans-serif' }}>GYM</span>
          </a>

          {/* PCメニュー */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
            <a href="#about" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)', transition: 'color 0.2s' }} className="hover:text-[var(--color-primary)]">想い</a>
            <a href="#pricing" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)', transition: 'color 0.2s' }} className="hover:text-[var(--color-primary)]">料金</a>
            <a href="#access" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)', transition: 'color 0.2s' }} className="hover:text-[var(--color-primary)]">アクセス</a>
            <a href="/aika19" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--color-bg-base)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }} className="hover:scale-105">
              <span style={{ fontSize: '1.2rem' }}>✨</span> AIKA19
            </a>
          </nav>

          {/* ヘッダーCTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://lin.ee/1TPJ2JH"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex"
              style={{
                backgroundColor: '#06C755',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '0.9rem',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(6, 199, 85, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>LINEで予約</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ===== ヒーローセクション（2025年版 Kawaii Style） ===== */}
        <section
          style={{
            position: 'relative',
            height: '100vh',
            minHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: '80px'
          }}
        >
          {/* 背景画像 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1
            }}
          >
            <Image
              src="/images/hero_new.png"
              alt="楽しそうにキックボクシングをする女性たち"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              priority
            />
            {/* グラデーションオーバーレイ（ふんわり白ピンク） */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(255,245,247,0.85) 0%, rgba(255,255,255,0.5) 100%)'
              }}
            />
          </div>

          <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            {/* キャッチコピー */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                fontWeight: '900',
                lineHeight: '1.3',
                marginBottom: '1.5rem',
                color: 'var(--color-text-main)',
                letterSpacing: '0.05em',
                fontFamily: '"Zen Maru Gothic", sans-serif',
                textShadow: '2px 2px 0px #FFF'
              }}
            >
              やさしく強く。<br />
              はじめての格闘技は<br className="md:hidden" />FLATUPGYMへ。
            </h1>

            {/* サブコピー */}
            <p
              style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: '1.8',
                marginBottom: '3rem',
                fontWeight: '700',
                color: 'var(--color-text-main)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                display: 'inline-block',
                padding: '0.75rem 2rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-sm)',
                fontFamily: '"Zen Maru Gothic", sans-serif'
              }}
            >
              成田市・初心者専門 ｜ キックボクシング / キッズ / ブラジリアン柔術
            </p>

            {/* CTAボタン */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <a
                href="https://lin.ee/1TPJ2JH"
                target="_blank"
                rel="noopener noreferrer"
                className="animate-bounce-slow"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  padding: '1.25rem 3rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '900',
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  boxShadow: '0 8px 20px rgba(255, 158, 172, 0.6)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '4px solid white',
                  fontFamily: '"Zen Maru Gothic", sans-serif'
                }}
              >
                <span>＼ 体験レッスン０円！／</span>
              </a>

              <a
                href="https://lin.ee/1TPJ2JH"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#06C755',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(6, 199, 85, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: '"Zen Maru Gothic", sans-serif'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>💬</span>
                LINEで予約する
              </a>
            </div>
          </div>

          {/* スクロールインジケーター */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'bounce 2s infinite',
              opacity: 0.6
            }}
          >
            <span style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>↓</span>
          </div>
        </section>

        {/* ===== 基本情報バー ===== */}
        <div
          style={{
            backgroundColor: 'var(--color-navy)',
            color: 'white',
            padding: '1.25rem 0',
            fontSize: 'clamp(0.75rem, 2vw, 0.9375rem)',
            fontWeight: '500'
          }}
        >
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'clamp(1rem, 3vw, 2rem)',
                textAlign: 'center'
              }}
            >
              <span>📍 成田市土屋516-4 2F</span>
              <span className="desktop-text">🚗 大型駐車場無料</span>
              <span>📞 070-9035-3485</span>
              <span className="desktop-text">⏰ 月〜土営業</span>
            </div>
          </div>
        </div>

        {/* ===== お悩みセクション ===== */}
        <section className="section" style={{ backgroundColor: '#F9F9F9', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-element)', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              こんなお悩みありませんか？
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
              }}
            >
              {/* カード1 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😓</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                  ダイエットが続かない
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', fontSize: '1rem' }}>
                  「何度もダイエットに挑戦するけど、いつも三日坊主で終わってしまう…」
                </p>
              </div>

              {/* カード2 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😤</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                  ストレスが溜まっている
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', fontSize: '1rem' }}>
                  「仕事や家事のストレスを発散する場所がない。モヤモヤが溜まる一方…」
                </p>
              </div>

              {/* カード3 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😰</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                  一人でジムに行くのは不安
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', fontSize: '1rem' }}>
                  「ジムに一人で行くのは勇気がいる。周りの目が気になってしまう…」
                </p>
              </div>

              {/* カード4 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😨</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                  格闘技ジムは男性ばかりで怖い
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', fontSize: '1rem' }}>
                  「格闘技ジムって男性ばかりで厳しそう…女性でも大丈夫？」
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 選ばれる理由セクション ===== */}
        <section className="section" style={{ backgroundColor: 'white', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-element)', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              FLAT-UP GYMが選ばれる3つの理由
            </h2>

            {/* 理由1: 左:写真 / 右:テキスト */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
                alignItems: 'center',
                marginBottom: 'clamp(5rem, 8vw, 6.25rem)'
              }}
            >
              <div style={{ order: 1 }}>
                <img
                  src="/images/instructor.png"
                  alt="女性オーナーAIKA"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
              </div>
              <div style={{ order: 2 }}>
                <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-coral-pink)' }}>
                  女性オーナーの安心感
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.9', fontSize: 'var(--font-size-body)' }}>
                  女性オーナーAIKAが直接指導。女性ならではの視点で、きめ細やかなサポートと快適な環境を提供します。
                </p>
              </div>
            </div>

            {/* 理由2: 右:写真 / 左:テキスト */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
                alignItems: 'center',
                marginBottom: 'clamp(5rem, 8vw, 6.25rem)'
              }}
            >
              <div style={{ order: 2 }} className="desktop-order-1">
                <img
                  src="/images/feature_beginners.png"
                  alt="初心者に優しい"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
              </div>
              <div style={{ order: 1 }} className="desktop-order-2">
                <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-coral-pink)' }}>
                  初心者・女性に特化
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.9', fontSize: 'var(--font-size-body)' }}>
                  会員の8割が運動経験ゼロからスタート。あなたのペースで楽しく学べます。
                </p>
              </div>
            </div>

            {/* 理由3: 左:写真 / 右:テキスト */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
                alignItems: 'center'
              }}
            >
              <div style={{ order: 1 }}>
                <img
                  src="/images/feature_clean.png"
                  alt="アットホームな雰囲気"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
              </div>
              <div style={{ order: 2 }}>
                <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-coral-pink)' }}>
                  アットホームな雰囲気
                </h3>
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.9', fontSize: 'var(--font-size-body)' }}>
                  仲間と一緒に励まし合いながら目標達成。無理な勧誘は一切ありません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== クラス選択セクション ===== */}
        <section className="section" style={{ backgroundColor: '#F9F9F9', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-element)', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              あなたにぴったりのクラスは？
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
              }}
            >
              {/* カード1: レディース */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>👩</div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', textAlign: 'center' }}>
                  レディースクラス
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                  ダイエット・美容・ストレス解消
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-coral-pink)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  月額¥8,800
                </p>
                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-coral-pink)',
                    color: 'white',
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink)';
                  }}
                >
                  詳しく見る →
                </a>
              </div>

              {/* カード2: 産後ママ */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>👶</div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', textAlign: 'center' }}>
                  産後ママクラス
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                  子連れOK・30分レッスン
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-coral-pink)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  月額¥8,800
                </p>
                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-coral-pink)',
                    color: 'white',
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink)';
                  }}
                >
                  詳しく見る →
                </a>
              </div>

              {/* カード3: キッズ */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>🧒</div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', textAlign: 'center' }}>
                  キッズクラス
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                  礼儀・体力向上・護身術
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-coral-pink)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  月額¥7,700
                </p>
                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-coral-pink)',
                    color: 'white',
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink)';
                  }}
                >
                  詳しく見る →
                </a>
              </div>

              {/* カード4: シニア */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>👴</div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', textAlign: 'center' }}>
                  シニアクラス
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                  健康維持・認知症予防
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-coral-pink)', textAlign: 'center', marginBottom: '1.5rem' }}>
                  月額¥8,800
                </p>
                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-coral-pink)',
                    color: 'white',
                    padding: '0.875rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-coral-pink)';
                  }}
                >
                  詳しく見る →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 料金プランセクション ===== */}
        <section id="pricing" className="section" style={{ backgroundColor: 'white', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              シンプルで分かりやすい料金プラン
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-body)', marginBottom: 'var(--spacing-element)' }}>
              入会金・年会費なし！月額制で安心
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
              }}
            >
              {/* カード1: キッズプラン */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem 2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '2px solid var(--color-gray-200)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  キッズプラン
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                  小学1〜6年生
                </p>
                <p style={{ fontSize: 'clamp(2.25rem, 5vw, 2.625rem)', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  ¥7,700
                  <span style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--color-gray-600)' }}>/月</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '2rem' }}>（税込）</p>

                <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem', color: 'var(--color-gray-600)', lineHeight: '2' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    週3回通い放題
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    護身術・体力向上
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    礼儀マナー指導
                  </li>
                </ul>

                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-navy)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy)';
                  }}
                >
                  体験予約
                </a>
              </div>

              {/* カード2: レディースプラン（人気No.1） */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem 2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 12px 32px rgba(255, 215, 0, 0.3)',
                  border: '3px solid #FFD700',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  position: 'relative',
                  transform: 'scale(1.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 215, 0, 0.3)';
                }}
              >
                {/* 人気No.1バッジ */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '1rem',
                    backgroundColor: '#FFD700',
                    color: '#1E3A5F',
                    padding: '0.5rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '900',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.5)'
                  }}
                >
                  ★ 人気No.1 ★
                </div>

                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: '#FFD700', marginTop: '1rem' }}>
                  レディースプラン
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                  女性専用
                </p>
                <p style={{ fontSize: '3rem', fontWeight: '900', color: '#FFD700', marginBottom: '0.5rem', lineHeight: '1' }}>
                  ¥8,800
                  <span style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--color-gray-600)' }}>/月</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '2rem' }}>（税込）</p>

                <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem', color: 'var(--color-gray-600)', lineHeight: '2' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    週3回レッスン
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    ダイエット・美容
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    子連れ参加OK
                  </li>
                </ul>

                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: '#FFD700',
                    color: '#1E3A5F',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFC700';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFD700';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
                  }}
                >
                  体験予約
                </a>
              </div>

              {/* カード3: メンズプラン */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem 2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '2px solid var(--color-gray-200)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
              >
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  メンズプラン
                </h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                  高校生以上男性
                </p>
                <p style={{ fontSize: 'clamp(2.25rem, 5vw, 2.625rem)', fontWeight: '900', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  ¥9,900
                  <span style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--color-gray-600)' }}>/月</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: '2rem' }}>（税込）</p>

                <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem', color: 'var(--color-gray-600)', lineHeight: '2' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    週3回通い放題
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    キック・MMA・BJJ
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--color-lime-green)', fontSize: '1.25rem' }}>✓</span>
                    選手育成も可能
                  </li>
                </ul>

                <a
                  href="https://lin.ee/1TPJ2JH"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    backgroundColor: 'var(--color-navy)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy)';
                  }}
                >
                  体験予約
                </a>
              </div>
            </div>

            {/* 回数券オプション */}
            <div
              style={{
                backgroundColor: 'var(--color-light-gray)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}
            >
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-navy)' }}>
                回数券オプション
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '2rem',
                  fontSize: '0.9375rem',
                  color: 'var(--color-gray-600)'
                }}
              >
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>ビジター</span>
                  <br />
                  ¥3,000/回
                </div>
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>回数券6回</span>
                  <br />
                  ¥15,000（半年有効）
                </div>
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>回数券12回</span>
                  <br />
                  ¥30,000（1年有効）
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== お客様の声セクション ===== */}
        <section className="section" style={{ backgroundColor: '#F9F9F9', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-element)', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              お客様の声
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {/* カード1 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative'
                }}
              >
                {/* 引用符アイコン */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '3rem',
                    color: 'var(--color-coral-pink)',
                    opacity: '0.2',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  "
                </div>

                {/* アバターと名前 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-coral-pink-light)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      marginRight: '1rem'
                    }}
                  >
                    👩
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>A.Mさん</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>30代女性</p>
                  </div>
                </div>

                {/* タイトル */}
                <h5 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-coral-pink)', marginBottom: '1rem' }}>
                  「運動が苦手な私でも続けられました！」
                </h5>

                {/* 本文 */}
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.9', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                  運動経験が全くなく不安でしたが、トレーナーさんが優しく丁寧に教えてくれるので楽しく続けられています。体重が減っただけでなく、気持ちも前向きに！
                </p>

                {/* 星評価 */}
                <div style={{ fontSize: '1.25rem', color: '#FFD700' }}>
                  ★★★★★
                </div>
              </div>

              {/* カード2 */}
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '2.5rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative'
                }}
              >
                {/* 引用符アイコン */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '3rem',
                    color: 'var(--color-coral-pink)',
                    opacity: '0.2',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  "
                </div>

                {/* アバターと名前 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-coral-pink-light)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      marginRight: '1rem'
                    }}
                  >
                    👩
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>K.Tさん</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>20代女性</p>
                  </div>
                </div>

                {/* タイトル */}
                <h5 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-coral-pink)', marginBottom: '1rem' }}>
                  「仕事のストレスが吹き飛びます！」
                </h5>

                {/* 本文 */}
                <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.9', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                  仕事のストレスが溜まっていましたが、ミット打ちは最高のストレス発散になります。週2回通うのが楽しみです！
                </p>

                {/* 星評価 */}
                <div style={{ fontSize: '1.25rem', color: '#FFD700' }}>
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 無料体験セクション ===== */}
        <section className="section" style={{ backgroundColor: 'white', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              まずは無料体験！30分で気軽に試せます
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-body)', marginBottom: 'var(--spacing-element)' }}>
              簡単4ステップで、あなたも今日から始められます
            </p>

            {/* 4ステップタイムライン */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem',
                position: 'relative'
              }}
            >
              {/* ステップ1 */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-coral-pink)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 20px rgba(255, 107, 122, 0.3)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>📱</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-navy)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.125rem',
                    zIndex: 3
                  }}
                >
                  1
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  LINEまたは電話で予約
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  30秒で簡単予約
                </p>
              </div>

              {/* ステップ2 */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-coral-pink)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 20px rgba(255, 107, 122, 0.3)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>👕</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-navy)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.125rem',
                    zIndex: 3
                  }}
                >
                  2
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  当日は手ぶらでOK
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  グローブ無料レンタル
                </p>
              </div>

              {/* ステップ3 */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-coral-pink)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 20px rgba(255, 107, 122, 0.3)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>🥊</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-navy)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.125rem',
                    zIndex: 3
                  }}
                >
                  3
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  30分の優しいレッスン
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  あなたのペースで
                </p>
              </div>

              {/* ステップ4 */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-coral-pink)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 20px rgba(255, 107, 122, 0.3)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>💬</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-navy)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '1.125rem',
                    zIndex: 3
                  }}
                >
                  4
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
                  料金・システム説明
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  無理な勧誘なし
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem', color: 'var(--color-navy)', textAlign: 'center' }}>
                よくある質問
              </h3>

              {/* FAQ項目1 */}
              <details
                style={{
                  backgroundColor: 'white',
                  border: '2px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <summary
                  style={{
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    color: 'var(--color-navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    listStyle: 'none'
                  }}
                >
                  <span>Q. 運動経験ゼロでも大丈夫？</span>
                  <span style={{ fontSize: '1.5rem', color: 'var(--color-coral-pink)' }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '1rem', borderLeft: '3px solid var(--color-coral-pink)' }}>
                  A. 会員の8割が初心者スタート！運動が苦手な方でも、女性オーナーが優しく丁寧に指導します。あなたのペースで無理なく始められます。
                </p>
              </details>

              {/* FAQ項目2 */}
              <details
                style={{
                  backgroundColor: 'white',
                  border: '2px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <summary
                  style={{
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    color: 'var(--color-navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    listStyle: 'none'
                  }}
                >
                  <span>Q. 持ち物は？</span>
                  <span style={{ fontSize: '1.5rem', color: 'var(--color-coral-pink)' }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '1rem', borderLeft: '3px solid var(--color-coral-pink)' }}>
                  A. 動きやすい服・タオル・飲み物だけでOK！グローブやミットは無料でレンタルできます。更衣室も完備しているので、お仕事帰りでも安心です。
                </p>
              </details>

              {/* FAQ項目3 */}
              <details
                style={{
                  backgroundColor: 'white',
                  border: '2px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <summary
                  style={{
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    color: 'var(--color-navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    listStyle: 'none'
                  }}
                >
                  <span>Q. 体験後すぐ入会しないとダメ？</span>
                  <span style={{ fontSize: '1.5rem', color: 'var(--color-coral-pink)' }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '1rem', borderLeft: '3px solid var(--color-coral-pink)' }}>
                  A. 帰宅後にゆっくり考えてOKです！無理な勧誘は一切ありません。ご自身のペースで検討していただけます。気になることがあれば、いつでもLINEでお気軽にご相談ください。
                </p>
              </details>
            </div>

            {/* 体験予約CTA */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a
                href="https://lin.ee/1TPJ2JH"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-lime-green)',
                  color: 'white',
                  padding: '1.25rem 3rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '900',
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                  boxShadow: '0 10px 30px rgba(0, 200, 83, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '56px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 200, 83, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 200, 83, 0.4)';
                }}
              >
                <span style={{ fontSize: '2rem' }}>💬</span>
                LINEで無料体験を予約する
              </a>
            </div>
          </div>
        </section>

        {/* ===== アクセスセクション ===== */}
        <section id="access" className="section" style={{ backgroundColor: 'white', padding: 'var(--spacing-section) 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--spacing-element)', color: 'var(--color-navy)', fontSize: 'var(--font-size-h2)', fontWeight: '900' }}>
              アクセス
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-body)', marginBottom: 'var(--spacing-element)' }}>
              車で来やすい！大型駐車場無料
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'start'
              }}
            >
              {/* 左側: Googleマップ */}
              <div style={{ width: '100%', height: '450px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.8!2d140.3!3d35.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQyJzAwLjAiTiAxNDDCsDE4JzAwLjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* 右側: 詳細情報 */}
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📍</span>
                    住所
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                    〒286-0011<br />
                    千葉県成田市土屋516-4 2F
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🚗</span>
                    お車でお越しの方
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                    国道51号線沿い<br />
                    大型駐車場完備（無料）
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🚃</span>
                    電車でお越しの方
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                    京成本線「公津の杜駅」<br />
                    徒歩約15分
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📞</span>
                    電話番号
                  </h3>
                  <p style={{ paddingLeft: '2rem' }}>
                    <a
                      href="tel:070-9035-3485"
                      style={{
                        color: 'var(--color-coral-pink)',
                        fontWeight: '700',
                        fontSize: '1.25rem',
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-coral-pink-dark)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-coral-pink)'}
                    >
                      070-9035-3485
                    </a>
                    <br />
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>（タップで発信）</span>
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>💬</span>
                    LINE
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                    @jfl0054o
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⏰</span>
                    営業時間
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', paddingLeft: '2rem' }}>
                    月〜土: 10:30〜21:00<br />
                    日祝: 休館日
                  </p>
                </div>

                <div style={{ paddingLeft: '2rem' }}>
                  <a
                    href="https://lin.ee/1TPJ2JH"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'var(--color-lime-green)',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '1.0625rem',
                      boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-lime-green-dark)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 200, 83, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-lime-green)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 200, 83, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>💬</span>
                    体験レッスンを予約
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTAセクション ===== */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-coral-pink) 100%)',
            padding: 'var(--spacing-section) 0',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              さあ、次はあなたの番。
            </h2>
            <p style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', marginBottom: '2.5rem', opacity: '0.95', lineHeight: '1.8' }}>
              新しい自分に出会う一歩を踏み出そう！
            </p>
            <a
              href="https://lin.ee/1TPJ2JH"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'white',
                color: 'var(--color-coral-pink)',
                padding: '1.25rem 3rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '900',
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                border: 'none',
                cursor: 'pointer',
                minHeight: '56px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{ fontSize: '2rem' }}>💬</span>
              無料体験レッスンを予約する
            </a>
          </div>
        </section>
      </main >

      {/* ===== フッター ===== */}
      <footer style={{ backgroundColor: 'var(--color-navy)', color: 'white', padding: '3rem 0 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--color-coral-pink)' }}>
                FLAT-UP GYM
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                女性オーナーが創る、世界一優しい格闘技ジム。あなたのペースで、あなたらしく。
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'white' }}>アクセス</h4>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                〒286-0011<br />
                千葉県成田市土屋516-4 2F<br />
                無料駐車場完備
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'white' }}>営業時間</h4>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                月〜土曜日<br />
                詳しくはお問い合わせください
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'white' }}>お問い合わせ</h4>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
                <a href="tel:070-9035-3485" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-coral-pink-light)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                  📞 070-9035-3485
                </a>
              </p>
              <a
                href="https://lin.ee/1TPJ2JH"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-lime-green)',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-lime-green-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-lime-green)';
                }}
              >
                💬 LINE友だち追加
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
              <a href="/privacy" style={{ marginRight: '1.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>プライバシーポリシー</a>
              <a href="/terms" style={{ marginRight: '1.5rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>利用規約</a>
              <a href="/law" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>特定商取引法</a>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
              © 2024 FLAT-UP GYM. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer >

      {/* ===== 固定フッターCTA（モバイルのみ） ===== */}
      < div
        className="mobile-sticky-footer"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          borderTop: '1px solid var(--color-gray-200)',
          padding: '1rem 1.5rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          zIndex: 999,
          display: 'none'
        }}
      >
        <a
          href="https://lin.ee/1TPJ2JH"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--color-lime-green)',
            color: 'white',
            padding: '1rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: '900',
            fontSize: '1.0625rem',
            boxShadow: '0 4px 20px rgba(0, 200, 83, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            minHeight: '56px'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>💬</span>
          LINEで無料体験予約
        </a>
      </div >

      {/* ===== レスポンシブスタイル ===== */}
      < style jsx > {`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-phone {
            display: flex !important;
          }
          .desktop-text {
            display: inline !important;
          }
          .desktop-order-1 {
            order: 1 !important;
          }
          .desktop-order-2 {
            order: 2 !important;
          }
        }
        
        @media (max-width: 768px) {
          .mobile-sticky-footer {
            display: block !important;
          }
          .desktop-text {
            display: none;
          }
          body {
            padding-bottom: 88px;
          }
        }
      `}</style >
    </div >
  );
}
