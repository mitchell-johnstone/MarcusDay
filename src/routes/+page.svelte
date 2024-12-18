<script lang="ts">
  import movieDatabase from '$lib/movie-data.json';
  const projectName = "Marcus Movie Day";
  let selectedDate = new Date().toISOString().split('T')[0];
  let movies: any[] = [];
  let loading = false;

  // Pre-generate dates for the next 30 days
  const today = new Date();
  const availableDates = Array.from({length: 30}, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // Pre-fetched movie data (you would need to generate this during build)
//   const movieDatabase = {
//     '2024-03-20': [
//       {
//         title: 'Movie 1',
//         showtimes: ['12:00 PM', '3:00 PM'],
//         imageUrl: '/images/movie1.jpg'
//       }
//       // ... more movies
//     ],
//     // ... more dates
//   };

  function handleDateChange() {
    loading = true;
    // Simulate loading
    setTimeout(() => {
      movies = movieDatabase[selectedDate] || [];
      loading = false;
    }, 300);
  }
</script>

<main>
  <div class="container">
    <h1>{projectName}</h1>
    
    <div class="date-selector">
      <label for="date">Select Date:</label>
      <select 
        id="date" 
        bind:value={selectedDate} 
        on:change={handleDateChange}
      >
        {#each availableDates as date}
          <option value={date}>
            {new Date(date).toLocaleDateString()}
          </option>
        {/each}
      </select>
    </div>

    {#if loading}
      <div class="loading">Loading movies...</div>
    {:else if movies.length === 0}
      <p>No movies found for selected date. Please choose a different date.</p>
    {:else}
      <div class="movie-grid">
        {#each movies as movie}
          <div class="movie-card">
            {#if movie.imageUrl}
              <img src={movie.imageUrl} alt={movie.title} />
            {/if}
            <h2>{movie.title}</h2>
            <div class="showtimes">
              {#each movie.showtimes as time}
                <span class="time">{time}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 2rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 2rem;
  }

  .date-selector {
    margin-bottom: 2rem;
    text-align: center;
  }

  input[type="date"] {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-left: 1rem;
  }

  .movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .movie-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .movie-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }

  .movie-card h2 {
    margin: 1rem 0;
    font-size: 1.2rem;
    color: #2c3e50;
  }

  .showtimes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .time {
    background: #e9ecef;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style>
