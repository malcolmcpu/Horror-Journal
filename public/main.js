console.log('main.js loaded');
const deleteButtons = document.querySelectorAll('.deleteButton');
console.log('buttons found: ', deleteButtons.length);

deleteButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const id = button.dataset.id;
    const movieCard = button.closest('.movie-display-card');

    try {
      const response = await fetch(`delete/${id}`, { method: 'DELETE' });

      if (response.ok) {
        console.log('Successful deletion of movie card.');
        movieCard.remove();
      } else {
        console.log('Could not find the movie card, check your ID');
        alert('Unable to delete this review');
      }
    } catch (err) {
      console.error(err);
      alert('Backend error. Review not');
    }
  });
});
