
let water;
let prompt = 10;
let years = [];
let colors1 = ["#273987", "#4290c9", "#6AE6F7", "#a67155", "#6b381d"];
let colors2 = ["#a03f95", "#ba56a3", "#DA8EE7", "#8BC34A", "#C4DDBD"];
let colors3 = ["#FF4E20", "#f5bbfa", "#FFCAFA", "#C2D968", "#AACDFE"];
let userColor = colors3;
let buttonsDiv;

function preload() {
  water = loadJSON("water.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("Arial");

  buttonsDiv = createDiv();
  buttonsDiv.style('display', 'flex');
  buttonsDiv.style('justify-content', 'center');
  buttonsDiv.style('gap', '10px');
  buttonsDiv.style('margin-bottom', '10px');
  buttonsDiv.position(0, windowHeight - 30);
  buttonsDiv.style('width', '100%');
  buttonsDiv.style('flex-wrap', 'wrap');

  let yb1 = createButton("1988-1998");
  let yb2 = createButton("1988-2008");
  let yb3 = createButton("1988-2018");

  yb1.mouseClicked(() => change_year(10));
  yb2.mouseClicked(() => change_year(20));
  yb3.mouseClicked(() => change_year(30));

  let cb1 = createButton("Blue-Orange");
  let cb2 = createButton("Green-Pink");
  let cb3 = createButton("Pink-Orange");

  cb1.mouseClicked(() => change_color(colors1));
  cb2.mouseClicked(() => change_color(colors2));
  cb3.mouseClicked(() => change_color(colors3));

  const allButtons = [yb1, yb2, yb3, cb1, cb2, cb3];
  allButtons.forEach(btn => {
    btn.parent(buttonsDiv);
    btn.style('padding', '4px 10px');
    btn.style('font-size', '11px');
    btn.style('background-color', '#fff9c4');
    btn.style('border', 'none');
    btn.style('border-radius', '10px');
    btn.style('box-shadow', '0 1px 3px rgba(0,0,0,0.1)');
    btn.style('cursor', 'pointer');
  });

  rebuildVisual();
}

function draw() {
  background('#fcf9eb');

  for (let year of years) {
    // Draw background color for the year row
    fill(year.backgroundColor);
    rect(0, year.y, width, year.patterns[0].s * 3);

    for (let pattern of year.patterns) {
      pattern.checkHover(mouseX, mouseY);
      pattern.show();
    }
  }
}

function change_color(colorIn) {
  userColor = colorIn;
  rebuildVisual();
}

function change_year(yearIn) {
  prompt = yearIn;
  rebuildVisual();
}

function rebuildVisual() {
  years = [];
  let spacing = 8;
  let topMargin = 15;
  let visualHeight = height * 0.55;
  let rowHeight = (visualHeight - (prompt - 1) * spacing) / prompt;
  let rectHeight = rowHeight / 2;
  let y = topMargin;

  let all_year = 0;
  for (let i = 0; i < prompt; i++) {
    years.push(water.years[i]);
    all_year += Number(water.years[i].accumulate);
  }

  for (let i = 0; i < prompt; i++) {
    let x = 0;
    years[i].patterns = [];
    years[i].y = y; // Store Y for draw()
    years[i].backgroundColor = getBackgroundColor(userColor); // Add background color for this year row

    for (let j = 0; j < years[i].months.length; j++) {
      let accu = years[i].months[j];
      let rectWidth = ((accu / years[i].accumulate) * (width - 120));

      let chooseColor = userColor;
      let t = j / 11;
      let col = lerpColor(color(chooseColor[1]), color(chooseColor[0]), t);

      if (rectWidth > 200) col = chooseColor[0];
      else if (rectWidth > 170) col = chooseColor[1];
      else if (rectWidth > 100) col = chooseColor[2];
      else if (rectWidth > 50) col = chooseColor[3];
      else col = chooseColor[4];

      let monthName = getMonthName(j);
      years[i].patterns.push(new Pattern(x, y, rectWidth, rectHeight, accu, col, monthName, years[i].year));
      x += rectWidth + 5;
    }

    let maxAccu = max(...years[i].months);
    let maxLines = floor(rectHeight * 1.5);
    let lineCount = constrain(floor(maxAccu / 500), 1, maxLines);
    let lineHeight = 3;
    let orangeLineSpace = lineCount * lineHeight + 10;

    y += (rectHeight * 3) + orangeLineSpace;
  }
}

function getBackgroundColor(colors) {
  if (colors === colors1) return '#e6d073';
  if (colors === colors2) return '#3c594b';
  if (colors === colors3) return 'yellow';
  return '#e6d073';
}

function getMonthName(index) {
  let names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[index % 12];
}

class Pattern {
  constructor(x, y, data_in, s, accu, col, month, year) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.data = data_in;
    this.s = s;
    this.accu = accu;
    this.month = month;
    this.year = year;
    this.hovered = false;
  }

  checkHover(mx, my) {
    this.hovered =
      (mx > this.x && mx < this.x + this.data && (
        (my > this.y && my < this.y + this.s) ||
        (my > this.y + this.s && my < this.y + this.s * 2) ||
        (my > this.y + this.s * 2 && my < this.y + this.s * 3)
      ));
  }

  show() {
    push();
    fill(this.hovered ? lerpColor(color(this.col), color(255), 0.4) : this.col);
    stroke(this.hovered ? 'black' : 'none');
    strokeWeight(1);
    rect(this.x, this.y, this.data, this.s);
    rect(this.x + 20, this.y + this.s, this.data, this.s);
    rect(this.x + 40, this.y + this.s * 2, this.data, this.s);
    pop();

    if (this.hovered) {
      let label = `${this.month} ${this.year - 543} | Water: ${this.accu} MCM`;
      let textW = textWidth(label) + 38;
      let textH = 20;

      let tooltipX = this.x;

      if (tooltipX + textW > width) {
        tooltipX = width - textW - 5;
      }
      if (tooltipX < 0) {
        tooltipX = 5;
      }

      push();
      fill(255);
      stroke(200);
      rect(tooltipX - 2, this.y - textH, textW, textH, 5);

      fill(0);
      noStroke();
      textSize(14);
      textAlign(LEFT, TOP);
      text(label, tooltipX + 3, this.y - textH);
      pop();
    }

    push();
    let maxLines = floor(this.s * 1.5);
    let lineCount = constrain(floor(this.accu / 500), 1, maxLines);

    for (let i = 0; i < lineCount; i++) {
      stroke('#f5472c');
      strokeWeight(1.5);
      let yLine = (this.y + this.s * 2.8) + 8 + i * 3;
      line(0, yLine, windowWidth, yLine);
    }
    pop();
  }
}
