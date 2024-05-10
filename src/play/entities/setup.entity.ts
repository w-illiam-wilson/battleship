export class Position {
    //this is the left most and upper most position of the boat
    x: number;
    y: number;
    position: "RIGHT" | "DOWN"
}

export class Setup {
    A: Position;
    B: Position;
    C: Position;
    D: Position;
    E: Position;
}