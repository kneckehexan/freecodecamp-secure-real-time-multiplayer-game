class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch (dir){
      case 'up':
        this.y = this.y - speed;
        break;
      case 'down':
        this.y = this.y + speed;
        break;
      case 'left':
        this.x = this.x - speed;
        break;
      case 'right':
        this.x = this.x + speed;
        break;
    }
  }

  collision(item) {
    //if (this.x === item.x && this.y === item.y){
    //  return true;
    //}
    return false;
  }

  draw (context, img) {
    context.drawImage(img, this.x, this.y);
  }

  calculateRank(arr) {
    arr.sort((a,b) => a.score - b.score);
    var currentRank = arr.indexOf(this.id) + 1;
    var totalPlayers = arr.length
    return `Rank: ${currentRank}/${totalPlayers}`
  }
}

try {
  module.exports = Player;
} catch (e) {
  console.error(e);
}
export default Player;
