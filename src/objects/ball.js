class ball
{
    x;
    y;
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

}function ballUpdate(ball)
{
  ball.x++ * math.cos(ball.direction);
  ball.y++ * math.sin(ball.direction);
}