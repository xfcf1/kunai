class Tools {
  public static generateRandom(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start) + start)
  }
}