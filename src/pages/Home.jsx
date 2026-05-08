import './Home.css'
import mePhoto from '../../image/me.jpg'

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-avatar">
          <img src={mePhoto} alt="Shengjia Cheng" className="hero-avatar-image" />
        </div>
        <div className="hero-info">
          <h1 className="hero-name">Hi, I'm Shengjia Cheng</h1>
          <p className="hero-title">Master Candidate · Artificial Intelligence & Computer Vision</p>
          <p className="hero-title">People's Public Security University of China</p>
          <p className="hero-bio">
            I am a Master candidate working at the intersection of artificial intelligence and computer vision. A High-energy individual who love the creative process.
          </p>
          <div className="hero-links">
            <a href="https://shengjiacheng.github.io" target="_blank" rel="noopener noreferrer" className="hero-link">
              GitHub
            </a>
            <a href="https://scholar.google.com/citations?hl=zh-CN&user=lAoWX-YAAAAJ&scilu=&scisig=AFPfF8cAAAAAaf2ceiA-0syfljPlH5hIpY7lNXs&gmla=AIqSsVuRmViIfbLbVoAO6NgVLy6GX2OMUMawL5ZoQQgtd9O6KdzcDucISWaqldLbmfhaKvdFTVForxQKA_XiYFGb9abMfKsG9-bQDwM0BIo&sciund=3482866046278039359" target="_blank" rel="noopener noreferrer" className="hero-link">
              Google Scholar
            </a>
            <a href="mailto:2024211527@stu.ppsuc.edu.cn" className="hero-link">
              Email
            </a>
            <a href="#" className="hero-link">
              CV / Resume
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">
          <span className="section-dot"></span>
          Research Areas
        </h2>
        <div className="skills-grid">
          <div className="skill-card">
            <h3>🔒 Privacy Protection</h3>
            <p>Differential privacy, federated learning, geoprivacy risk assessment and mitigation</p>
          </div>
          <div className="skill-card">
            <h3>👁️ Computer Vision</h3>
            <p>Image understanding, object detection, scene recognition, visual feature analysis</p>
          </div>
          <div className="skill-card">
            <h3>🤖 VLM Finetuning</h3>
            <p>Deep learning, adversarial learning, model robustness, data augmentation</p>
          </div>
          <div className="skill-card">
            <h3>🌍 Geoinformatics</h3>
            <p>Geospatial data analysis, VGI data mining, location privacy</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">
          <span className="section-dot"></span>
          Education
        </h2>
        <div className="edu-list">
          {/* <div className="edu-item">
            <span className="edu-year">2023 - Now</span>
            <div className="edu-content">
              <h3>Ph.D. Candidate · Computer Science</h3>
              <p>University · Privacy Computing & Computer Vision</p>
            </div>
          </div> */}
          <div className="edu-item">
            <span className="edu-year">2024 - 2027</span>
            <div className="edu-content">
              <h3>M.S. · Artificial Intelligence</h3>
              <p>People's Public Security University of China</p>
            </div>
          </div>
          <div className="edu-item">
            <span className="edu-year">2020 - 2024</span>
            <div className="edu-content">
              <h3>B.S. · Cyber Security & Law Enforcement</h3>
              <p>People's Public Security University of China</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
