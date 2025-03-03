
type Fixture = {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    points: number[];
    fill: string;
    name: string;
    color?: string; // Add color property
    scaleX: number;
    scaleY: number;
    rotation: number;
}

export default Fixture;