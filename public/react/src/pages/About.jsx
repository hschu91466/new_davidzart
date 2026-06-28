import { CDN_BASE } from "../config";

function About() {
  return (
    <div className="container about-layout">
      <div className="about-image">
        <img
          src={`${CDN_BASE}/site-images/FB_IMG_1656795141955.jpg`}
          alt="David Schu, artist"
        />
      </div>
      <div className="about-text">
        <h1>About the Artist</h1>
        <p>
          I've been making art for most of my life. What started in high school
          grew into a lifelong pursuit that led me to earn a Master of Fine Arts
          degree and continue exploring watercolor as my primary medium. My work
          often falls somewhere between landscape and abstraction, inspired by
          the natural world and the feelings and memories connected to it.
        </p>
        <p>
          Over the years, painting has become a way of slowing down, paying
          attention, and making sense of the world around me. Whether painting a
          familiar scene or something more abstract, I'm interested in capturing
          not just what something looks like, but what it feels like.
        </p>
        <p>
          My life is rooted in faith, family, and the everyday disciplines of
          prayer and reflection. Through prayer, Bible study, and the quiet
          practice of painting, I continue to look for beauty, truth, and
          meaning in both the ordinary and the extraordinary moments of life.
        </p>
        <p>
          Outside the studio, I spend my time with my wife, children, and
          grandchildren, who bring joy, perspective, and plenty of reasons to
          laugh. Music is also a lifelong companion, and I spend many hours
          playing the flugelhorn and flute. The rhythms of faith, family, music,
          and reflection may not always be obvious in the finished work, but
          they are present in every brushstroke.
        </p>
      </div>
    </div>
  );
}

export default About;
