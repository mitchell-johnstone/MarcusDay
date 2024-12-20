import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function fetchMovieData() {
  const movieData = {};
  const baseUrl = 'https://www.marcustheatres.com/theatre-locations/north-shore-cinema-mequon';
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const date = new Date().toISOString().split('T')[0];
    
    await page.goto(`${baseUrl}?Date=${date}`);
    await page.waitForSelector('.movie-showtimes');

    movieData[date] = await page.evaluate(() => {
      const movies = [];
      document.querySelectorAll('.movie-showtimes').forEach(element => {
        // get movie details
        const movieDetails = element.querySelector('.movie-showtimes__info--details');
        const rating = movieDetails?.querySelector('.rating-link')?.textContent?.trim() || '';
        const detailsText = movieDetails?.textContent?.trim() || '';
        const duration = detailsText.match(/(\d+)\s*hours?,\s*(\d+)\s*minutes/)?.[0] || '';
        const genres = detailsText.split('|')[2]?.trim() || '';
        
        // Get screenings data
        const screenings = [];
        element.querySelectorAll('.movie-showtimes__screen-type').forEach(screenType => {
          const screenTypeElement = screenType.querySelector('.screen-type__text');
          const screenName = screenTypeElement?.querySelector('strong')?.textContent?.trim() || 
                            screenTypeElement?.querySelector('img')?.getAttribute('alt')?.trim() || '';
          const showtimes = Array.from(screenType.querySelectorAll('.movie-showtime--a, .matinee'))
            .map(showtime => showtime.textContent.trim())
            .filter(Boolean);
          
          if (screenName && showtimes.length > 0) {
            screenings.push({
              screen: screenName,
              times: showtimes
            });
          }
        });
        
        const movie = {
          title: element.querySelector('.movie-title')?.textContent?.trim() || '',
          poster: element.querySelector('.movie-info__poster-img')?.getAttribute('data-src') || '',
          rating: rating,
          duration: duration,
          genres: genres,
          screenings: screenings
        };
        movies.push(movie);
      });
      return movies;
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'src/lib/movie-data.json'),
    JSON.stringify(movieData, null, 2)
  );
}

fetchMovieData(); 