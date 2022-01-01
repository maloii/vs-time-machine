export enum Color {
    BLUE = 1,
    GREEN = 2,
    CYAN = 3,
    RED = 4,
    MAGENTA = 5,
    YELLOW = 6,
    WHITE = 7,
    BLACK = 0
}

export const ColorCss: Record<Color, string> = {
    [Color.BLUE]: 'BLUE',
    [Color.GREEN]: 'GREEN',
    [Color.CYAN]: 'CYAN',
    [Color.RED]: 'RED',
    [Color.MAGENTA]: 'MAGENTA',
    [Color.YELLOW]: 'YELLOW',
    [Color.WHITE]: 'WHITE',
    [Color.BLACK]: 'BLACK'
};
