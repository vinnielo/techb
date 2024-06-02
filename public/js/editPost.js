const editPostHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#post-title').value.trim();
  const content = document.querySelector('#post-content').value.trim();
  const id = window.location.pathname.split('/').pop();

  if (title && content) {
    try {
      const response = await fetch(`/api/post/edit/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Failed to update the post: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the post.');
    }
  } else {
    alert('Please fill out both the title and content fields.');
  }
};

document
  .querySelector('.edit-post-form')
  .addEventListener('submit', editPostHandler);