export function parseCSV(data: string) {
  const lines = data.trim().split(/\r?\n/);
  const errors: any[] = [];
  const validBooks: any[] = [];

  if (lines.length < 2) {
    return {
      validBooks: [],
      errors: [{ message: "CSV must contain header and at least one row" }]
    };
  }

  
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const expectedHeaders = ["title", "author", "publishedyear"]; 
  
  const isValidHeader = expectedHeaders.every(
    (h, i) => headers[i] === h
  );

  if (!isValidHeader) {
    return {
      validBooks: [],
      errors: [{
        message: `Invalid CSV header. Expected: ${expectedHeaders.join(",")}`
      }]
    };
  }

  
  lines.slice(1).forEach((line, index) => {
    if (!line.trim()) return;

    const values = line.split(",").map(v => v.trim());

    if (values.length !== 3) {
      errors.push({
        row: index + 2,
        message: "Incorrect number of fields"
      });
      return;
    }

    const [title, author, publishedYearStr] = values;

    if (!title || !author || !publishedYearStr) {
      errors.push({
        row: index + 2,
        message: "Missing required field"
      });
      return;
    }

  
    const yearNum = Number(publishedYearStr);
    if (isNaN(yearNum)) {
      errors.push({
        row: index + 2,
        message: "publishedYear must be a number"
      });
      return;
    }

    validBooks.push({
      title,
      author,
      publishedYear: yearNum
    });
  });

  return { validBooks, errors };
}