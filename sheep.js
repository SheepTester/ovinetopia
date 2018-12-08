const sheep = [];

const SHEEP_SIZE = 5;

class Sheep {

  constructor(x = 0, y = 0, name = '') {
    sheep.push(this);
    this.x = x;
    this.y = y;
    this.xv = this.yv = 0;
    this.name = name;

    this.noCheck = false;
    this.leader = null;
    this.destination = null;
    this.members = 0;
  }

  drawSheep(context) {
    context.moveTo(this.x + SHEEP_SIZE, this.y);
    context.arc(this.x, this.y, SHEEP_SIZE, 0, FULL_CIRCLE);
  }

  drawShadow(context) {
    context.moveTo(this.x + SHEEP_SIZE, this.y + SHEEP_SIZE);
    context.ellipse(this.x, this.y + SHEEP_SIZE, SHEEP_SIZE, SHEEP_SIZE / 2, 0, 0, FULL_CIRCLE);
  }

  headTo(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 0.2);
    const angle = Math.atan2(dy, dx);
    this.xv += Math.cos(angle) * dist;
    this.yv += Math.sin(angle) * dist;
  }

  move() {
    if (this.noCheck) this.noCheck = false;
    else sheep.find(shep => {
      if (shep === this) return;
      const dx = shep.x - this.x;
      const dy = shep.y - this.y;
      if (dx === 0 && dy === 0) {
        const angle = Math.random() * FULL_CIRCLE;
        this.xv += Math.cos(angle) * SHEEP_SIZE;
        this.yv += Math.sin(angle) * SHEEP_SIZE;
        return true;
      } else if (dx * dx + dy * dy < 4 * SHEEP_SIZE * SHEEP_SIZE) {
        [shep.xv, this.xv] = [this.xv, shep.xv];
        [shep.yv, this.yv] = [this.yv, shep.yv];
        shep.noCheck = true;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * (SHEEP_SIZE * 2 - dist + 1e-5);
        this.y -= Math.sin(angle) * (SHEEP_SIZE * 2 - dist + 1e-5);
        return true;
      } else if (dx * dx + dy * dy < 64 * SHEEP_SIZE * SHEEP_SIZE) {
        const leader = shep.followingLeader || (shep.destination ? shep : null);
        if (leader && !this.followingLeader && !this.members && Math.random() < (leader.members + 1) / 100) {
          this.followingLeader = leader;
          leader.members++;
          this.destination = null;
        }
      }
    });
    if (this.followingLeader) {
      if (!this.followingLeader.destination) this.followingLeader = null;
      else if (Math.random() < this.followingLeader.members / 1000) {
        this.followingLeader.members--;
        this.followingLeader = null;
      }
      else {
        this.headTo(this.followingLeader.destination.x, this.followingLeader.destination.y);
      }
    } else if (this.destination) {
      this.headTo(this.destination.x, this.destination.y);
    } else if (Math.random() < 0.01) {
      this.destination = {x: Math.random() * 200 - 100 + this.x, y: Math.random() * 200 - 100 + this.y};
      this.members = 0;
    }
    this.x += this.xv;
    this.y += this.yv;
    this.xv *= 0.9;
    this.yv *= 0.9;
    if (this.destination) {
      if (Math.abs(this.destination.x - this.x) < this.members + 1 && Math.abs(this.destination.y - this.y) < this.members + 1) {
        this.destination = null;
      }
    }
  }

  remove() {
    const index = sheep.indexOf(this);
    if (~index) sheep.splice(index, 1);
  }

}

function drawSheep() {
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.beginPath();
  sheep.forEach(s => s.drawShadow(c));
  c.fill();
  c.fillStyle = 'white';
  c.beginPath();
  sheep.forEach(s => s.drawSheep(c));
  c.fill();
}
function moveSheep() {
  sheep.forEach(s => s.move());
}
