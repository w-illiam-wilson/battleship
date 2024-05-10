import { Score } from "./score.entity";

export class Hit {
    x: number;
    y: number;
    status: "MISS" | "HIT" | "SINK";
    score: Score
}