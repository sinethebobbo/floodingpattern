let water;
let prompt = 10;
let years = [];
//let colors0 = ["#087E8F","#087E8F", "#6AE6F7", "#F76B3F", "#FD3D00"];
let colors1 = ["#273987","#4290c9", "#6AE6F7", "#a67155", "#6b381d"];
let colors2 = ["#a03f95","#ba56a3", "#DA8EE7", "#8BC34A", "#C4DDBD"];
let colors3 = ["#FF4E20", "#f5bbfa", "#FFCAFA", "#C2D968", "#AACDFE"];
let userColor = colors3;
let accu;

function preload() {
  water = loadJSON("water.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(800, 800);
  //background("#928ee8");
  //background('#2225D8');
  background('#fcf9eb');
  noStroke();
  years = []; // 🔧 Reset the array before repopulating it
  year_button1 = createButton("1988-1998");
  year_button2 = createButton("1988-2008");
  year_button3 = createButton("1988-2018");
  color_button1 = createButton("Blue-Orange");
  color_button2 = createButton("Green-Pink");
  color_button3 = createButton("Pink-Orange");
  color_button1.mouseClicked(function () { change_color(colors1) });
  color_button2.mouseClicked(function () { change_color(colors2) });
  color_button3.mouseClicked(function () { change_color(colors3) });
  year_button1.mouseClicked(function () { change_year(10) });
  year_button2.mouseClicked(function () { change_year(20) });
  year_button3.mouseClicked(function () { change_year(30) });

  let y = 0;
  let all_year = 0;
  for (let i = 0; i < prompt; i++) {
    years.push(water.years[i]);
    all_year += Number(water.years[i].accumulate);
  }
  for (let i = 0; i < prompt; i++) {
    //years.push(water.years[i]);
    let x = 0;
    //translate(0, 0);
    years[i].patterns = [];
    // let rectHeight = (((height-50*prompt) / prompt) / 3); // Proportionate height
    //that year / all year
    let proportion = (years[i].accumulate / (all_year/5));
    //let rectHeight = (height - prompt * proportion) / prompt ;
    let rectHeight = (proportion * (height-20))/(prompt*2) ;
    for (let j = 0; j < years[i].months.length; j++) {
      let p = [];
      fill('yellow');
      //fill('#3c594b');
      //fill('#e6d073');
      //fill('brown');
      rect(x, y, width, rectHeight * 3);
      accu = years[i].months[j];
      let rectWidth = ((years[i].months[j] / years[i].accumulate) * (width - 120)); // Proportionate width


      let chooseColor = userColor
      //let chooseColor = colors2;

      let t = j / 11; // Normalized value (0 to 1)
      let col = lerpColor(color(chooseColor[1]), color(chooseColor[0]), t);
      // console.log(rectWidth);
      
      if (rectWidth > 200) {
        col = chooseColor[0]
      } else if (rectWidth > 170) {
        col = chooseColor[1]
      } else if (rectWidth > 100) {
        col = chooseColor[2]
      } else if (rectWidth > 50) {
        col = chooseColor[3]
      } else {
        col = chooseColor[4]
      };
      
     // Determine index based on width range

      years[i].patterns.push(new Pattern(x, y, rectWidth, rectHeight, accu, col));
      x += rectWidth + 5;
      //x += rectWidth;
      //y += rectHeight;
    }
    //y += (rectHeight * 3) + (accu/100)*20;
    y += (rectHeight * 3) + 20;
    console.log(y)
    console.log(accu);
    //y += 200;
  }

  for (let year of years) {
    for (let pattern of year.patterns) pattern.show();
  }
}

class Pattern {
  constructor(x, y, data_in, s, accu, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.data = data_in;
    this.points = [];
    this.s = s;
    this.accu = accu;
    //this.s = 20;
    for (let i = 0; i < 20; i++) {
      //let px = this.x + this.data * 2
      //let py = this.y
    }
  }
  show() {
    translate(0, 0);
    fill(this.col);
    //noFill();
    //pattern
    push();
    //shearX(-PI / 6); // Skew the x-axis by -30 degrees
    rect(this.x, this.y, this.data, this.s); // Draw the rectangle
    rect(this.x + 20, this.y + this.s, this.data, this.s);
    rect(this.x + 40, this.y + this.s * 2, this.data, this.s);
    pop();
    // rect(this.x, this.y, this.data, 50); // Draw the rectangle
    //line
    push();
    for (let i = 0; i < this.accu / 500; i++) {
      //stroke('darkgreen');
      //stroke('brown');
      stroke('#f5472c');
      //stroke('#73b2ba');
      strokeWeight(1.5);
      line(0, (this.y + this.s * 2) + this.s + (i * 3)+8, windowWidth, (this.y + this.s * 2) + this.s + (i * 3)+8);
    }
    pop();
  }
}

function change_color(colorIn) {
  userColor = colorIn;
  setup()
} 

function change_year(yearIn) {
  prompt = yearIn;
  setup(); // <-- this makes it redraw with the new year range
}





