import * as csvParser from 'fast-csv';

interface ParseCSVOptions {
  delimiter: ';' | ',';
}

/**
 * Parses an uploaded Graphql CSV file with `createReadStream` as method
 * @param file
 * @param options
 */
export const parseCsv = async (file: any, options: ParseCSVOptions = { delimiter: ';' }): Promise<any[]> => {
  const results: any[] = [];
  await new Promise((resolve, reject) => file.createReadStream()
    .pipe(csvParser.parse({ headers: true, delimiter: options.delimiter }))
    .on('error', (error: any) => reject(error))
    .on('data', (row: any) => results.push(row))
    .on('end', (row: any) => resolve(row)));

  return results;
};
