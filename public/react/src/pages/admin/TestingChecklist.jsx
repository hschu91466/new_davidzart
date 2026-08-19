export default function TestingChecklist() {
  return (
    <div className="admin-page">
      <h1>Admin Testing Checklist</h1>
      <p className="intro-text">
        Use this checklist when testing admin features. Go through each section
        and verify functionality works as expected.
      </p>

      <section className="checklist-section">
        <h2>Authentication & Access</h2>
        <ul>
          <li>Log in with admin account</li>
          <li>Verify dashboard/admin area loads</li>
          <li>Log out and verify session clears</li>
          <li>Try accessing admin area without logging in (should redirect)</li>
          <li>Test session timeout behavior if applicable</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Gallery Management</h2>

        <h3>Viewing & Organization</h3>
        <ul>
          <li>View full gallery list</li>
          <li>Verify galleries display in correct sort order</li>
          <li>Activate/deactivate a gallery and verify status changes</li>
          <li>
            Move gallery up/down in the list and verify sort updates correctly
          </li>
          <li>Check that active/inactive status reflects in public view</li>
        </ul>

        <h3>Creating & Editing</h3>
        <ul>
          <li>Create a new gallery with title, slug, and description</li>
          <li>Verify new gallery appears in list</li>
          <li>Edit existing gallery (change title, description)</li>
          <li>Verify changes save and display correctly</li>
          <li>
            Try creating gallery with duplicate slug (should error or prevent)
          </li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Image Management</h2>

        <h3>Uploading</h3>
        <ul>
          <li>Upload a new image to a gallery</li>
          <li>Verify image appears in gallery immediately</li>
          <li>Upload multiple images in sequence</li>
          <li>Try uploading very large file (should handle gracefully)</li>
          <li>Try uploading unsupported file type (should error)</li>
        </ul>

        <h3>Editing Images</h3>
        <ul>
          <li>Edit image title, caption, year, medium, dimensions</li>
          <li>Verify edits save and display</li>
          <li>Mark image as sold/not sold</li>
          <li>Toggle image published/unpublished status</li>
          <li>Verify unpublished images don't show on public gallery</li>
        </ul>

        <h3>Image Organization</h3>
        <ul>
          <li>Move image up/down within gallery</li>
          <li>Verify sort order updates correctly</li>
          <li>Move image from one gallery to another</li>
          <li>Delete an image and verify it's removed</li>
          <li>Check that deleted images don't appear anywhere</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Comment Moderation</h2>

        <h3>Viewing & Filtering</h3>
        <ul>
          <li>View all pending comments</li>
          <li>View approved comments</li>
          <li>View spam comments</li>
          <li>Check comment counts match displayed lists</li>
          <li>Filter by status if applicable</li>
        </ul>

        <h3>Approving Comments</h3>
        <ul>
          <li>Approve a pending comment</li>
          <li>Verify it moves to approved section</li>
          <li>Check that approved comments appear on public site</li>
        </ul>

        <h3>Spam Management</h3>
        <ul>
          <li>Mark a comment as spam</li>
          <li>Verify it moves to spam section</li>
          <li>Delete a spam comment</li>
        </ul>

        <h3>Deleting Comments</h3>
        <ul>
          <li>Delete an approved comment</li>
          <li>Verify it's removed from all views</li>
          <li>Delete a pending comment</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>User Management</h2>

        <h3>Viewing Users</h3>
        <ul>
          <li>View all pending user registrations</li>
          <li>View approved users</li>
          <li>Check user approval counts</li>
        </ul>

        <h3>Approving Users</h3>
        <ul>
          <li>Approve a pending user registration</li>
          <li>Verify user can now log in</li>
          <li>Verify approved user appears in approved list</li>
        </ul>

        <h3>User Deletion</h3>
        <ul>
          <li>Delete a user account</li>
          <li>Verify user can no longer log in</li>
          <li>Verify user is removed from user list</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Contact Messages</h2>

        <h3>Viewing Messages</h3>
        <ul>
          <li>View all contact form submissions</li>
          <li>Identify read vs unread messages</li>
          <li>Verify timestamps display correctly</li>
        </ul>

        <h3>Managing Messages</h3>
        <ul>
          <li>Mark a message as read</li>
          <li>Verify it no longer shows as unread</li>
          <li>Delete a message</li>
          <li>Verify deleted message is gone</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>UI Behavior & Loading States</h2>

        <h3>During Operations</h3>
        <ul>
          <li>Watch for loading indicators when uploading images</li>
          <li>Verify buttons disable during API calls</li>
          <li>Check that saving or loading feedback appears</li>
          <li>Verify loading state clears after operation completes</li>
        </ul>

        <h3>Error Feedback</h3>
        <ul>
          <li>Trigger an error (e.g., try uploading invalid file)</li>
          <li>Verify error message displays clearly</li>
          <li>Try operation again after error</li>
          <li>Verify you can recover from errors without page refresh</li>
        </ul>

        <h3>Success Feedback</h3>
        <ul>
          <li>
            Perform a successful action (create gallery, upload image, etc.)
          </li>
          <li>Verify success feedback appears</li>
          <li>Check that data updates correctly on page</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Data Consistency</h2>

        <h3>Galleries & Images</h3>
        <ul>
          <li>
            Create gallery, add images, move them, check sort order is
            consistent
          </li>
          <li>Delete an image, refresh page, verify it's still gone</li>
          <li>Edit gallery, refresh page, verify changes persist</li>
          <li>Check that image counts match what you see</li>
        </ul>

        <h3>Comments</h3>
        <ul>
          <li>Approve a comment, refresh page, verify it stayed approved</li>
          <li>Delete a comment, refresh page, verify it's gone</li>
          <li>Check pending/approved counts after operations</li>
        </ul>

        <h3>Users</h3>
        <ul>
          <li>Approve a user, refresh page, verify approval stuck</li>
          <li>Delete a user, refresh page, verify deletion stuck</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Navigation & Flow</h2>

        <h3>Admin Interface</h3>
        <ul>
          <li>
            Navigate between different admin sections (galleries, comments,
            users, messages)
          </li>
          <li>Verify each section loads correctly</li>
          <li>Check that navigation menu/links work</li>
          <li>Try back button after operations (should work smoothly)</li>
        </ul>

        <h3>Public View</h3>
        <ul>
          <li>Log out and view public galleries</li>
          <li>Verify only active, published content shows</li>
          <li>Verify unpublished images don't appear</li>
          <li>Check that comments appear where they should</li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Edge Cases & Problem Scenarios</h2>
        <ul>
          <li>Create gallery with no images (should display but be empty)</li>
          <li>
            Upload image to gallery, then deactivate gallery (image should be
            hidden publicly)
          </li>
          <li>Approve a user, then delete them (should work without error)</li>
          <li>
            Delete all images from a gallery (gallery should still exist but be
            empty)
          </li>
          <li>
            Try rapid consecutive uploads (should queue properly, not duplicate)
          </li>
          <li>
            Switch between admin and public view multiple times (data should
            stay in sync)
          </li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Performance Observations</h2>
        <ul>
          <li>Note if images load quickly or slowly</li>
          <li>Check if list pages feel responsive with lots of items</li>
          <li>Observe sorting operations (should be instant)</li>
          <li>
            Check if page refresh happens unnecessarily (should be minimal)
          </li>
        </ul>
      </section>

      <section className="checklist-section">
        <h2>Notes for Tester</h2>
        <ul>
          <li>
            Test in typical workflow order (create gallery → add images →
            organize → approve comments)
          </li>
          <li>
            After each operation, refresh the page to verify data persists
          </li>
          <li>Try operations both on desktop and mobile if possible</li>
          <li>
            If you find anything broken or confusing, note: what you did, what
            happened, what you expected
          </li>
          <li>
            If loading is slow or UI feels unresponsive, note specific actions
            that cause it
          </li>
        </ul>
      </section>
    </div>
  );
}
