export default function PublicSiteReview() {
  return (
    <div className="admin-page">
      <h1>Public Site Review Checklist</h1>
      <p className="intro-text">
        Just look through the website and let us know if everything looks good
        and works the way you'd expect. Don't worry about technical details—just
        notice what you see and how it feels to use.
      </p>

      <section className="checklist-section">
        <h2>Does It Look Good?</h2>
        <ul>
          <li>The colors look nice together</li>
          <li>Text is easy to read (not too small or blurry)</li>
          <li>Images are clear and load properly</li>
          <li>The layout looks neat and organized</li>
          <li>Nothing looks broken or out of place</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Can You Navigate Easily?</h2>
        <ul>
          <li>You can easily find the galleries</li>
          <li>You can get back to the home page without confusion</li>
          <li>The menu at the top makes sense</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Do Things Work?</h2>
        <ul>
          <li>Click on galleries and they open</li>
          <li>Click on images and they show in a larger view</li>
          <li>You can navigate between images in the enlarged view</li>
          <li>Links go to the right places</li>
          <li>The site loads quickly and doesn't lag</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Comments</h2>
        <ul>
          <li>You can find a place to leave a comment</li>
          <li>The form is easy to understand</li>
          <li>You can fill in your name and comment without confusion</li>
          <li>The submit button is easy to find and works</li>
          <li>You get a message confirming your comment was submitted</li>
          <li>Existing comments (if any) display properly below</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Does It Work on Different Devices?</h2>
        <ul>
          <li>On a computer, the layout looks good</li>
          <li>On a tablet, the layout adjusts and still looks good</li>
          <li>On a phone, everything stacks nicely and is easy to read</li>
          <li>On all devices, you can still click and navigate</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Content & Details</h2>
        <ul>
          <li>Gallery names and descriptions are correct</li>
          <li>Image titles and descriptions look right</li>
          <li>No placeholder text or obvious errors</li>
          <li>Artwork information (year, medium, etc.) looks accurate</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Overall Feel</h2>
        <ul>
          <li>The site looks professional</li>
          <li>It feels like a cohesive, intentional design</li>
          <li>The colors and style match what you'd expect</li>
          <li>Browsing galleries feels natural and enjoyable</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Any Issues or Comments?</h2>
        <ul>
          <li>Is anything confusing or hard to understand?</li>
          <li>Did you find anything that doesn't work?</li>
          <li>Is there anything you'd like to see different?</li>
          <li>Any typos or text that looks wrong?</li>
        </ul>
      </section>
    </div>
  );
}
