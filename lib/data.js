// lib/data.js  — shared constants & grading logic

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "teach123";

const ROSTER = {
  "Aarohi Agrawal":         {p1:"madhu_b@yahoo.com",              p2:"atul.cisco@gmail.com",            student:"33aagrawal@stratfordschools.net"},
  "Alisha Agrawal":         {p1:"jaya.agr09@gmail.com",           p2:"neelkamal@gmail.com",             student:"33aagrawal1@stratfordschools.net"},
  "Ananya Arvind":          {p1:"rashmikn2009@gmail.com",         p2:"arvind_gopalan@yahoo.com",        student:"33aarvind@stratfordschools.net"},
  "Elizabeth Cai":          {p1:"wanglurg@gmail.com",             p2:"caijunjieustc@gmail.com",         student:"33ecai@stratfordschools.net"},
  "Eloisa Keojampa":        {p1:"melanie.gainsbury@gmail.com",    p2:"kyle.keojampa@gmail.com",         student:"33ekeojampa@stratfordschools.net"},
  "Eric Huang":             {p1:"susana.lee.2010@gmail.com",      p2:"huangweiosu@gmail.com",           student:"33ehuang2@stratfordschools.net"},
  "Erin Yuen":              {p1:"hector.yuen@gmail.com",          p2:"hector.yuen@gmail.com",           student:"33eyuen@stratfordschools.net"},
  "Evan Chang":             {p1:"chbang@gmail.com",               p2:"marklphie@gmail.com",             student:"33echang1@stratfordschools.net"},
  "Jennifer Chen":          {p1:"alicewest.alicewest@gmail.com",  p2:"alicewest.alicewest@gmail.com",   student:"alicewest.alicewest@gmail.com"},
  "Jenny Montgomery":       {p1:"liteng@gmail.com",               p2:"colin_montgomery@outlook.com",    student:"33jmontgomery@stratfordschools.net"},
  "Jooha Park":             {p1:"hyunyoungmoon@gmail.com",        p2:"sjpark12@gmail.com",              student:"33jpark1@stratfordschools.net"},
  "Leo Matsiev":            {p1:"aivanovskaya.chem@gmail.com",    p2:"matsiev@comcast.net",             student:"33lmatsiev@stratfordschools.net"},
  "Maya Benavidez":         {p1:"eduardo.benavidez@yahoo.com",    p2:"novayata@gmail.com",              student:"33mbenavidez@stratfordschools.net"},
  "Nathan Streeter":        {p1:"parents@mattstreeter.org",       p2:"matt@mattstreeter.org",           student:"33nstreeter@stratfordschools.net"},
  "Peyton Pereira":         {p1:"shearcilla@yahoo.com",           p2:"mgp08@yahoo.com",                 student:"33ppereira@stratfordschools.net"},
  "Rynshall Chen":          {p1:"sherry.lixiaoyuan@gmail.com",    p2:"jmchen2007@gmail.com",            student:"33rchen@stratfordschools.net"},
  "Samiha Java":            {p1:"akshayjava@gmail.com",           p2:"pinky.rijhwani@gmail.com",        student:"33sjava@stratfordschools.net"},
  "Tate Yeung":             {p1:"elaine.chan@gmail.com",          p2:"awyeung@icloud.com",              student:"33tyeung@stratfordschools.net"},
  "Thea Angelidis-Smith":   {p1:"smith.tommy@gmail.com",          p2:"maria.angelidou@gmail.com",       student:"33tangelidis-smith@stratfordschools.net"},
  "Vassilis Papadimitriou": {p1:"mariadal1@gmail.com",            p2:"ppapadim@gmail.com",              student:"33vpapadimitriou@stratfordschools.net"},
  "Isabelle Yan":           {p1:"iamyanxiao@yahoo.com",           p2:"liangyuanly@gmail.com",           student:"33iyan@stratfordschools.net"},
  "Ethan Jiang":            {p1:"asheng2@yahoo.com",              p2:"asheng2@yahoo.com",               student:"33ejiang@stratfordschools.net"},
  "Aarush Gupta":           {p1:"sumit.gupta@gmail.com",          p2:"adisumit@hotmail.com",            student:"33agupta@stratfordschools.net"},
  "Aria Pan":               {p1:"caiyanli@gmail.com",             p2:"panjunfeng@gmail.com",            student:"33apan@stratfordschools.net"},
  "Kaya Tobiczyk":          {p1:"mtobiczyk@gmail.com",            p2:"allagentis@gmail.com",            student:"33ktobiczyk@stratfordschools.net"},
  "Claire You":             {p1:"y2xd@yahoo.com",                 p2:"yzhuge@gmail.com",                student:"33cyou@stratfordschools.net"},
  "Lisa Zhang":             {p1:"zhangirene10@gmail.com",         p2:"junlin685@gmail.com",             student:"33lzhang2@stratfordschools.net"},
  "Ashra Vaka":             {p1:"darshanaik11@gmail.com",         p2:"kiran.vaka@gmail.com",            student:"33avaka@stratfordschools.net"},
  "Erik Xu":                {p1:"luckyrand@gmail.com",            p2:"jiant17@gmail.com",               student:"33exu@stratfordschools.net"},
  "Alisha Jain":            {p1:"ankurmania@gmail.com",           p2:"anjanidce@gmail.com",             student:"33ajain@stratfordschools.net"},
  "Catherine Wang":         {p1:"minizhuang@gmail.com",           p2:"qiyuan204er@hotmail.com",         student:"33cwang4@stratfordschools.net"},
  "Rita Liang":             {p1:"liang818@gmail.com",             p2:"rusiyu@gmail.com",                student:"33rliang@stratfordschools.net"},
  "Vikram Vemoory":         {p1:"surekha.vemoory@gmail.com",      p2:"madhav.vemoory@gmail.com",        student:"33vvemoory@stratfordschools.net"},
  "Neha Murthy":            {p1:"geetha.raghotham@gmail.com",     p2:"raghotham@gmail.com",             student:"33nmurthy@stratfordschools.net"},
  "Oliver Liu":             {p1:"jxu@peninsulafamilyservice.org", p2:"fredliu@hotmail.com",             student:"33oliu@stratfordschools.net"},
  "Becca Zhang":            {p1:"jiangyi11349@gmail.com",         p2:"lizhuzhang0219@gmail.com",        student:"33bzhang1@stratfordschools.net"},
  "Francis Wang":           {p1:"yinghuizhou@hotmail.com",        p2:"hua.wang.mo@gmail.com",           student:"33fwang@stratfordschools.net"},
  "Xinyan Shen":            {p1:"elinzeng1221@gmail.com",         p2:"shenwei.robert@gmail.com",        student:"33xshen1@stratfordschools.net"},
  "Xinkai Shen":            {p1:"elinzeng1221@gmail.com",         p2:"shenwei.robert@gmail.com",        student:"33xshen@stratfordschools.net"},
  "William Lu":             {p1:"tianfeng981226@gmail.com",       p2:"tianfeng981226@gmail.com",        student:"33wlu@stratfordschools.net"},
  "Elvin Qin":              {p1:"qinpeng1988@gmail.com",          p2:"joyzhao2667@gmail.com",           student:"33eqin@stratfordschools.net"}
};

// ── TEST 16A ──────────────────────────────────────────────────────────────────

const ANSWER_KEY = {
  q1:  ["6.70","6.7"],
  q2:  ["6"],
  q3:  ["b"],
  q4:  ["15"],
  q5:  ["960"],
  q6:  ["47"],
  q7ax:["-5"], q7ay:["1"], q7bx:["-1"], q7by:["1"], q7cx:["-3"], q7cy:["3"],
  q8:  ["b"],
  q9:  ["56"],
  q10a:["-80"], q10b:["1.2","1.20"], q10c:["-300"], q10d:["-1/6","-0.1667"],
  q11a:["0.8333","0.833","0.83"],
  q11b:["83.333%","83.33%","83.3%","83%","83.333","83.33","83.3"],
  q11c:["3/5"],
  q11d:["60%","60"],
  q12: ["36"], q13: ["1350"], q14: ["75"], q15: ["80"],
  q16: ["1.58"], q17: ["4/75","0.0533"], q18: ["5"],
  q19: ["10/3","3 1/3"], q20: ["5.1"]
};

const POINTS = {
  q1:5, q2:5, q3:5, q4:5, q5:5, q6:5,
  q7ax:0.84, q7ay:0.83, q7bx:0.84, q7by:0.83, q7cx:0.83, q7cy:0.83,
  q8:5, q9:5,
  q10a:1.25, q10b:1.25, q10c:1.25, q10d:1.25,
  q11a:1.25, q11b:1.25, q11c:1.25, q11d:1.25,
  q12:5, q13:5, q14:5, q15:5, q16:5, q17:5, q18:5, q19:5, q20:5
};

const ALL_KEYS = [
  "q1","q2","q3","q4","q5","q6",
  "q7ax","q7ay","q7bx","q7by","q7cx","q7cy",
  "q8","q9",
  "q10a","q10b","q10c","q10d",
  "q11a","q11b","q11c","q11d",
  "q12","q13","q14","q15","q16","q17","q18","q19","q20"
];

const QUESTION_TEXT = {
  q1:   "Q1  — Hourly earnings: Tim mowed 2 lawns ($7.50 each) and washed 4 cars ($6.30 each). Divide total by 6 hours.",
  q2:   "Q2  — Evaluate: x + (x² − xy) − y  where x=5, y=4",
  q3:   "Q3  — Which figure has all sides equal and all angles 60°? (multiple choice)",
  q4:   "Q4  — Ratio 3:4 for clean to dirty; 35 total items. How many clean?",
  q5:   "Q5  — Rate: 400 words in 25 min. Words per hour?",
  q6:   "Q6  — Circumference of circle with diameter 15 m (use π ≈ 3.14)",
  q7:   "Q7  — Translate triangle A(1,1) B(5,1) C(3,3) left 6 units. Give new coordinates.",
  q8:   "Q8  — Which number line shows x > −5? (multiple choice)",
  q9:   "Q9  — (1/4)h = 14. Solve for h.",
  q10a: "Q10a — 400 ÷ (−5)",
  q10b: "Q10b — (−7.2) ÷ (−6)",
  q10c: "Q10c — 15 × (−20)",
  q10d: "Q10d — (1/2)(−1/3)",
  q11a: "Q11a — Convert 5/6 to a decimal",
  q11b: "Q11b — Convert 5/6 to a percent",
  q11c: "Q11c — Convert 0.6 to a fraction in lowest terms",
  q11d: "Q11d — Convert 3/5 to a percent",
  q12:  "Q12  — Area of trapezoid with bases 5 m and 7 m, height 6 m",
  q13:  "Q13  — 600 = (4/9)n. Solve for n.",
  q14:  "Q14  — What percent of 40 is 30?",
  q15:  "Q15  — (3/5)m = 48. Solve for m.",
  q16:  "Q16  — x − 0.08 = 1.5. Solve for x.",
  q17:  "Q17  — Divide 5 1/3 by 100.",
  q18:  "Q18  — Simplify: 27 + 10 − 12/√25",
  q19:  "Q19  — Divide (14/3) by (7/5)",
  q20:  "Q20  — −2.6 + 4.2 + 3.5"
};

const SOLUTIONS = {
  q1:   "Tim mowed: 2x$7.50=$15.00 | Washed: 4x$6.30=$25.20 | Total: $40.20/6 = $6.70/hr",
  q2:   "x+(x2-xy)-y = 5+(25-20)-4 = 6",
  q3:   "All sides equal, all angles 60 degrees -> B",
  q4:   "Ratio 3:4, parts=7 | 35/7=5 per part -> Clean=3x5=15",
  q5:   "Rate=400/25=16/min -> 60x16=960",
  q6:   "C=pi x d=3.14x15=47.1 -> 47 m",
  q7:   "Subtract 6 from each x-coordinate: A(1,1)->A'(-5,1), B(5,1)->B'(-1,1), C(3,3)->C'(-3,3)",
  q8:   "x>-5: open circle at -5, shaded right -> B",
  q9:   "(1/4)h=14 -> h=56 inches",
  q10a: "400/(-5) = -80", q10b: "-7.2/(-6) = 1.2", q10c: "15x(-20) = -300", q10d: "(1/2)(-1/3) = -1/6",
  q11a: "5/6 = 0.8333...", q11b: "0.8333 x 100 = 83.33...%", q11c: "0.6=6/10=3/5", q11d: "3/5 x 100=60%",
  q12:  "Area=((5+7)x6)/2=36 m2",
  q13:  "600=(4/9)n -> n=1350",
  q14:  "(n/100)x40=30 -> n=75%",
  q15:  "(3/5)m=48 -> m=80",
  q16:  "1.5=x-0.08 -> x=1.58",
  q17:  "5 1/3 / 100=(16/3)/100=4/75",
  q18:  "27+10-12/sqrt(25)=27+10-12/5=25/5=5",
  q19:  "(14/3)/(7/5)=10/3",
  q20:  "-2.6+4.2+3.5=5.1"
};

const FACTS_ANSWERS = {
  f1:"-10", f2:"-6",  f3:"16",  f4:"4",
  f5:"-6",  f6:"-12", f7:"-27", f8:"-3",
  f9:"10",  f10:"14", f11:"-24",f12:"-6",
  f13:"-9", f14:"1",  f15:"-24",f16:"-6"
};

const FACTS_LABELS = [
  "(-8)+(-2)", "(-8)-(-2)", "(-8)(-2)",       "-8/-2",
  "(-9)+(+3)", "(-9)-(+3)", "(-9)(+3)",        "-9/+3",
  "12+(-2)",   "12-(-2)",   "(12)(-2)",         "12/-2",
  "(-4)+(-3)+(-2)", "(-4)-(-3)-(-2)", "(-4)(-3)(-2)", "(-4)(-3)/(-2)"
];

// ── TEST 17A ──────────────────────────────────────────────────────────────────

const ANSWER_KEY_17 = {
  q1:   ["25"],
  q2a:  ["84"],
  q2b:  ["90"],
  q2c:  ["87.5"],
  q2d:  ["50"],
  q3:   ["99"],
  q4:   ["470"],
  q5:   ["-3"],
  q6:   ["7xy-3x+y","4xy-3x+y"],
  q7:   ["48"],
  q8:   ["180"],
  q9a:  ["50000","50,000"],
  q9b:  ["10"],
  q10:  ["60"],
  q11:  ["113.04"],
  q12a: ["0.375"],
  q12b: ["37.5%","37.5"],
  q12c: ["7/20"],
  q12d: ["0.35"],
  q12e: ["11/20"],
  q12f: ["0.55"],
  q12g: ["60%","60"],
  q12h: ["0.06"],
  q13c: ["1.69"],
  q13e: ["6"],
  q14:  ["parallelogram","Parallelogram"],
  q14p: ["32"],
  q15:  ["54"],
  q16:  ["3"],
  q17:  ["21/16","1.3125","1 5/16"],
  q18:  ["0"],
  q19:  ["-8"],
  q20a: ["-1"],
  q20b: ["1"],
  q20c: ["3"]
};

const POINTS_17 = {
  q1:5,
  q2a:1.25, q2b:1.25, q2c:1.25, q2d:1.25,
  q3:5, q4:5, q5:5, q6:5, q7:5, q8:5,
  q9a:2.5, q9b:2.5,
  q10:5, q11:5,
  q12a:0.625, q12b:0.625, q12c:0.625, q12d:0.625,
  q12e:0.625, q12f:0.625, q12g:0.625, q12h:0.625,
  q13c:2.5, q13e:2.5,
  q14:2.5, q14p:2.5,
  q15:5, q16:5, q17:5, q18:5, q19:5,
  q20a:1.67, q20b:1.67, q20c:1.66
};

const ALL_KEYS_17 = [
  "q1",
  "q2a","q2b","q2c","q2d",
  "q3","q4","q5","q6","q7","q8",
  "q9a","q9b",
  "q10","q11",
  "q12a","q12b","q12c","q12d","q12e","q12f","q12g","q12h",
  "q13c","q13e",
  "q14","q14p",
  "q15","q16","q17","q18","q19",
  "q20a","q20b","q20c"
];

const QUESTION_TEXT_17 = {
  q1:   "Q1  — Ratio of games won to games played was 4:9. Team played 45 games. How many did they fail to win?",
  q2a:  "Q2a — Mean of: 55, 70, 80, 80, 85, 90, 90, 90, 95, 105",
  q2b:  "Q2b — Mode of: 55, 70, 80, 80, 85, 90, 90, 90, 95, 105",
  q2c:  "Q2c — Median of: 55, 70, 80, 80, 85, 90, 90, 90, 95, 105",
  q2d:  "Q2d — Range of: 55, 70, 80, 80, 85, 90, 90, 90, 95, 105",
  q3:   "Q3  — Ratio of dandelions to peonies is 11:4. There are 36 peonies. How many dandelions?",
  q4:   "Q4  — Unit multiplier: convert 0.47 km to meters (1 km = 1000 m)",
  q5:   "Q5  — Graph x = −3 on a number line",
  q6:   "Q6  — Collect like terms: 3xy + xy − 4x + y",
  q7:   "Q7  — Sound travels 2 miles in 10 seconds. How far in 4 minutes?",
  q8:   "Q8  — Before clowns arrived, 35% of children had happy faces. If 117 did not have happy faces, how many children in all?",
  q9a:  "Q9a — $45,000 was raised. This was nine tenths of the goal. What was the goal?",
  q9b:  "Q9b — The drive fell short of the goal by what percent?",
  q10:  "Q10 — Rectangular prism: 4 in long, 3 in wide, 5 in high. Find volume. Sketch.",
  q11:  "Q11 — Find the area of the circle (r = 6 cm, use π ≈ 3.14)",
  q12a: "Q12a — 3/8 as a decimal",
  q12b: "Q12b — 3/8 as a percent",
  q12c: "Q12c — Fraction equivalent to 35%",
  q12d: "Q12d — Decimal equivalent to 35%",
  q12e: "Q12e — Fraction equivalent to 55%",
  q12f: "Q12f — Decimal equivalent to 55%",
  q12g: "Q12g — 3/5 as a percent",
  q12h: "Q12h — 6% as a decimal",
  q13c: "Q13 — Scientific notation coefficient: (1.3 × 10³) × (1.3 × 10³)",
  q13e: "Q13 — Scientific notation exponent: (1.3 × 10³) × (1.3 × 10³)",
  q14:  "Q14 — Name this quadrilateral (sides 9 cm and 7 cm)",
  q14p: "Q14 — Perimeter of the quadrilateral",
  q15:  "Q15 — Area of the quadrilateral (base = 9 cm, height = 6 cm)",
  q16:  "Q16 — Solve: 15.4 − 1.4p = 5.4",
  q17:  "Q17 — Solve: z ÷ 3/4 = 2 − 1/4",
  q18:  "Q18 — Simplify: 3 · (2³ − (3 + 5))",
  q19:  "Q19 — Simplify: (−3) + (−4) − (−7) + (−8)",
  q20a: "Q20a — Function table: y = 2x + 1, find y when x = 0",
  q20b: "Q20b — Function table: y = 2x + 1, find y when x = 1",
  q20c: "Q20c — Function table: y = 2x + 1, find y when x = 2"
};

const SOLUTIONS_17 = {
  q1:   "Won = (4/9) x 45 = 20 -> failed to win = 45 - 20 = 25",
  q2a:  "(55+70+80+80+85+90+90+90+95+105)/10 = 840/10 = 84",
  q2b:  "90 appears 3 times (most frequent)",
  q2c:  "Sorted: 55,70,80,80,85,90,90,90,95,105 -> middle = (85+90)/2 = 87.5",
  q2d:  "105 - 55 = 50",
  q3:   "11/4 = d/36 -> d = (11 x 36)/4 = 99",
  q4:   "0.47 x 1000 = 470 m",
  q5:   "Plot a filled dot at -3 on the number line",
  q6:   "3xy + xy = 4xy; keep -4x and +y separate -> 4xy - 4x + y",
  q7:   "2 mi / 10 sec -> 4 min = 240 sec -> (2/10) x 240 = 48 miles",
  q8:   "65% did not have happy faces = 117 -> total = 117 / 0.65 = 180",
  q9a:  "(9/10) x goal = 45000 -> goal = 45000 / 0.9 = 50000",
  q9b:  "Fell short by 1/10 = 10%",
  q10:  "V = 4 x 3 x 5 = 60 in³",
  q11:  "A = π r² = 3.14 x 36 = 113.04 cm²",
  q12a: "3 ÷ 8 = 0.375",
  q12b: "0.375 x 100 = 37.5%",
  q12c: "35/100 = 7/20",
  q12d: "35 ÷ 100 = 0.35",
  q12e: "55/100 = 11/20",
  q12f: "55 ÷ 100 = 0.55",
  q12g: "3 ÷ 5 = 0.6 = 60%",
  q12h: "6 ÷ 100 = 0.06",
  q13c: "1.3 x 1.3 = 1.69",
  q13e: "10³ x 10³ = 10⁶ -> exponent = 6",
  q14:  "Two pairs of parallel sides -> parallelogram",
  q14p: "P = 2(9) + 2(7) = 32 cm",
  q15:  "A = base x height = 9 x 6 = 54 cm²",
  q16:  "1.4p = 15.4 - 5.4 = 10 -> p = 10/1.4 = ... check: answer is 3 if equation is 15.4-1.4p=12.4",
  q17:  "z = (7/4) x (3/4) = 21/16 = 1 5/16",
  q18:  "2³ = 8 -> 3+5 = 8 -> 8-8 = 0 -> 3 x 0 = 0",
  q19:  "(-3)+(-4) = -7 -> -7-(-7) = 0 -> 0+(-8) = -8",
  q20a: "y = 2(0)+1 = 1... check actual rule on test",
  q20b: "y = 2(1)+1 = 3... check actual rule on test",
  q20c: "y = 2(2)+1 = 5... check actual rule on test"
};

const FACTS_KEYS_17 = [
  "f1d","f1f","f2d","f2f","f3d","f3f","f4d","f4f","f5d","f5f","f6d","f6f",
  "f7d","f7f","f8d","f8f","f9d","f9f","f10d","f10f","f11d","f11f","f12d","f12f"
];

const FACTS_LABELS_17 = [
  "10%_dec","10%_frac","90%_dec","90%_frac","5%_dec","5%_frac",
  "12.5%_dec","12.5%_frac","50%_dec","50%_frac","25%_dec","25%_frac",
  "33.3%_dec","33.3%_frac","20%_dec","20%_frac","75%_dec","75%_frac",
  "66.7%_dec","66.7%_frac","1%_dec","1%_frac","250%_dec","250%_frac"
];

// Percent facts answer key for 17A
const FACTS_ANSWERS_17_MAP = {
  f1d:"0.1",   f1f:"1/10",
  f2d:"0.9",   f2f:"9/10",
  f3d:"0.05",  f3f:"1/20",
  f4d:"0.125", f4f:"1/8",
  f5d:"0.5",   f5f:"1/2",
  f6d:"0.25",  f6f:"1/4",
  f7d:"0.333", f7f:"1/3",
  f8d:"0.2",   f8f:"1/5",
  f9d:"0.75",  f9f:"3/4",
  f10d:"0.667",f10f:"2/3",
  f11d:"0.01", f11f:"1/100",
  f12d:"2.5",  f12f:"5/2"
};

// ── SHARED HELPERS ────────────────────────────────────────────────────────────

function getEmails(name) {
  const r = ROSTER[name] || {};
  const all = [r.p1||"", r.p2||"", r.student||""];
  const seen = {}, result = [];
  for (const e of all) {
    const t = e.trim();
    if (t && !seen[t]) { seen[t] = true; result.push(t); }
  }
  return result;
}

function norm(s) {
  return String(s||"").toLowerCase().replace(/\s+/g,"").replace(/,/g,"");
}

// ── TEST 16A GRADING ──────────────────────────────────────────────────────────

function gradeData(data) {
  const results = {};
  let total = 0;

  for (const k of ALL_KEYS) {
    const raw = String(data[k] || "").trim();
    const ans = norm(raw);
    let correct = false;
    for (const a of (ANSWER_KEY[k] || []).map(norm)) {
      if (ans !== "" && ans === a) { correct = true; break; }
    }
    const earned = correct ? POINTS[k] : 0;
    results[k] = { correct, earned, answer: raw };
    total += earned;
  }

  let factsCorrect = 0;
  const factsResults = {};
  const fd = data.facts || {};
  for (const fk of Object.keys(FACTS_ANSWERS)) {
    const raw = String(fd[fk] || "").trim();
    const correct = (raw === FACTS_ANSWERS[fk]);
    factsResults[fk] = { correct, answer: raw, expected: FACTS_ANSWERS[fk] };
    if (correct) factsCorrect++;
  }

  const factsScore = Math.round((factsCorrect / 16) * 5 * 100) / 100;
  total = Math.round(total * 100) / 100;
  const pct = Math.round((total / 100) * 100);
  const letter = pct>=90?"A":pct>=80?"B":pct>=70?"C":pct>=60?"D":"F";

  return {
    total, pct, letter, results,
    factsScore, factsCorrect, factsResults,
    pu_understand: data.pu_understand || "",
    pu_plan:       data.pu_plan       || "",
    pu_solve:      data.pu_solve      || "",
    pu_check:      data.pu_check      || ""
  };
}

// ── TEST 17A GRADING (used for email re-grade) ────────────────────────────────

function gradeData17(data) {
  const results = {};
  let total = 0;

  for (const k of ALL_KEYS_17) {
    const raw = String(data[k] || "").trim();
    const ans = norm(raw);
    let correct = false;
    for (const a of (ANSWER_KEY_17[k] || []).map(norm)) {
      if (ans !== "" && ans === a) { correct = true; break; }
    }
    const earned = correct ? (POINTS_17[k] || 0) : 0;
    results[k] = { correct, earned, answer: raw };
    total += earned;
  }

  let factsCorrect = 0;
  const factsResults = {};
  const fd = data.facts || {};
  FACTS_KEYS_17.forEach(fk => {
    const raw = String(fd[fk] || "").trim();
    const expected = FACTS_ANSWERS_17_MAP[fk] || "";
    const correct = raw !== "" && norm(raw) === norm(expected);
    factsResults[fk] = { correct, answer: raw, expected };
    if (correct) factsCorrect++;
  });

  const factsScore = Math.round((factsCorrect / 24) * 5 * 100) / 100;
  total = Math.round(total * 100) / 100;
  const pct = Math.round((total / 100) * 100);
  const letter = pct>=90?"A":pct>=80?"B":pct>=70?"C":pct>=60?"D":"F";

  return { total, pct, letter, results, factsScore, factsCorrect, factsResults };
}

// ── TEST 16A EMAIL ────────────────────────────────────────────────────────────

function buildEmailBody(sub) {
  const graded = gradeData(sub.data);
  const emails = getEmails(sub.name);
  const deduct = sub.unitDeductions || 0;
  const adjTotal = Math.max(0, Math.round((graded.total - deduct) * 100) / 100);

  const Q7K = ["q7ax","q7ay","q7bx","q7by","q7cx","q7cy"];
  const DIVIDER = "-".repeat(70);
  let questionLines = "";

  ALL_KEYS.filter(k => !Q7K.includes(k)).forEach(k => {
    const r = graded.results[k];
    const mark  = r.correct ? "✓ CORRECT" : "✗ INCORRECT";
    const pts   = r.correct ? `+${POINTS[k]} pts` : `+0 / ${POINTS[k]} pts`;
    const qText = QUESTION_TEXT[k] || k.toUpperCase();
    questionLines += `\n  ${qText}\n`;
    questionLines += `  Student answer : ${r.answer || "(blank)"}\n`;
    if (!r.correct) {
      questionLines += `  Correct answer : ${(ANSWER_KEY[k] || [""])[0]}\n`;
      questionLines += `  Solution       : ${SOLUTIONS[k] || ""}\n`;
    }
    questionLines += `  ${mark}  ${pts}\n`;
    questionLines += `  ${DIVIDER}\n`;
  });

  const q7ok = Q7K.every(k => graded.results[k].correct);
  const ax=graded.results.q7ax.answer||"(blank)", ay=graded.results.q7ay.answer||"(blank)";
  const bx=graded.results.q7bx.answer||"(blank)", by=graded.results.q7by.answer||"(blank)";
  const cx=graded.results.q7cx.answer||"(blank)", cy=graded.results.q7cy.answer||"(blank)";
  const q7pts = q7ok ? "+5 pts" : `+${Q7K.reduce((s,k)=> s + graded.results[k].earned, 0).toFixed(2)} / 5 pts`;
  questionLines += `\n  ${QUESTION_TEXT.q7}\n`;
  questionLines += `  Student answer : A'(${ax},${ay})  B'(${bx},${by})  C'(${cx},${cy})\n`;
  if (!q7ok) {
    questionLines += `  Correct answer : A'(-5,1)  B'(-1,1)  C'(-3,3)\n`;
    questionLines += `  Solution       : ${SOLUTIONS.q7}\n`;
  }
  questionLines += `  ${q7ok ? "✓ CORRECT" : "✗ INCORRECT"}  ${q7pts}\n`;
  questionLines += `  ${DIVIDER}\n`;

  let factsTable = "  #    PROBLEM                 YOUR ANS      RESULT\n";
  factsTable    += "  " + "-".repeat(56) + "\n";
  Object.keys(FACTS_ANSWERS).forEach((fk, i) => {
    const fr = graded.factsResults[fk];
    if (!fr) return;
    const mark = fr.correct ? "✓" : "✗  (correct: " + fr.expected + ")";
    factsTable += "  " + (i+1+".").padEnd(5) + (FACTS_LABELS[i]||fk).padEnd(24) + (fr.answer||"blank").padEnd(14) + mark + "\n";
  });

  const unitLine = deduct > 0
    ? `Unit deductions: -${deduct} pts\nAdjusted Score:  ${adjTotal} / 100\n`
    : "";
  const ps = (sub.psGrade !== undefined && sub.psGrade !== "") ? parseFloat(sub.psGrade) : null;
  const psGradeStr = ps !== null ? String(ps) : "__";
  const puTotalStr = ps !== null ? String(Math.round((graded.factsScore + ps) * 100) / 100) : "__";

  const body =
`Dear Parent/Guardian,

${sub.name} has completed Saxon Math Course 2 — Cumulative Test 16A.

${"=".repeat(54)}
TEST QUESTIONS (Q1–Q20)
${"=".repeat(54)}
Score: ${adjTotal} / 100  (${graded.pct}% before unit adjustments)
${unitLine}
${questionLines}
${"=".repeat(54)}
POWER UP (graded out of 10)
${"=".repeat(54)}
Facts:            ${graded.factsScore} / 5  (${graded.factsCorrect}/16 correct)
Problem Solving:  ${psGradeStr} / 5  (teacher graded)
TOTAL POWER UP:   ${graded.factsScore} + ${psGradeStr} = ${puTotalStr} / 10

FACTS DETAIL:
${factsTable}
PROBLEM SOLVING (teacher graded, 5 pts total):
  Understand (1 pt):  ${graded.pu_understand||"--"}
  Plan       (1 pt):  ${graded.pu_plan||"--"}
  Solve      (2 pts): ${graded.pu_solve||"--"}
  Check      (1 pt):  ${graded.pu_check||"--"}
  Correct Answer: Volume = 18 x 1 x 1.5 = 27 ft3 / 27 = 1 cubic yard

${"=".repeat(54)}
Please let me know if you notice any discrepancies so I can review them promptly.

Best regards,
Mrs. West`;

  return { to: emails, subject: `Saxon Math Test 16A Results - ${sub.name}`, body };
}

// ── TEST 17A EMAIL ────────────────────────────────────────────────────────────

function buildEmailBody17(sub) {
  const emails = getEmails(sub.name);
  const deduct = sub.unitDeductions || 0;

  // Re-grade from raw answers so we get per-question correct/wrong
  const reGraded = gradeData17(sub.data);

  // Use stored totals from sheet for the headline score (includes manual grading)
  const storedTotal = sub.graded ? sub.graded.total : reGraded.total;
  const storedPct   = sub.graded ? sub.graded.pct   : reGraded.pct;
  const storedFacts = sub.graded ? sub.graded.factsScore : reGraded.factsScore;
  const storedFactsCorrect = reGraded.factsCorrect;

  const adjTotal = Math.max(0, Math.round((storedTotal - deduct) * 100) / 100);
  const DIVIDER  = "-".repeat(70);
  let questionLines = "";

  ALL_KEYS_17.forEach(k => {
    const r = reGraded.results[k];
    if (!r) return;
    const mark  = r.correct ? "✓ CORRECT" : "✗ INCORRECT";
    const pts   = r.correct ? `+${POINTS_17[k]} pts` : `+0 / ${POINTS_17[k]} pts`;
    const qText = QUESTION_TEXT_17[k] || k.toUpperCase();
    questionLines += `\n  ${qText}\n`;
    questionLines += `  Student answer : ${r.answer || "(blank)"}\n`;
    if (!r.correct) {
      questionLines += `  Correct answer : ${(ANSWER_KEY_17[k] || [""])[0]}\n`;
      questionLines += `  Solution       : ${SOLUTIONS_17[k] || ""}\n`;
    }
    questionLines += `  ${mark}  ${pts}\n`;
    questionLines += `  ${DIVIDER}\n`;
  });

  // Facts detail table
  const percents = ["10%","90%","5%","12.5%","50%","25%","33.3%","20%","75%","66.7%","1%","250%"];
  const fd = sub.data.facts || {};
  let factsTable = "  #    PERCENT       DEC ANSWER    FRAC ANSWER   RESULT\n";
  factsTable    += "  " + "-".repeat(62) + "\n";
  percents.forEach((pctLabel, i) => {
    const dk   = `f${i+1}d`, fk = `f${i+1}f`;
    const dVal = fd[dk] || "(blank)";
    const fVal = fd[fk] || "(blank)";
    const dExp = FACTS_ANSWERS_17_MAP[dk] || "";
    const fExp = FACTS_ANSWERS_17_MAP[fk] || "";
    const dOk  = dVal !== "(blank)" && norm(dVal) === norm(dExp);
    const fOk  = fVal !== "(blank)" && norm(fVal) === norm(fExp);
    let result = "";
    if (dOk && fOk) {
      result = "✓";
    } else {
      if (!dOk) result += `dec ✗ (${dExp})  `;
      if (!fOk) result += `frac ✗ (${fExp})`;
    }
    factsTable += "  " + (i+1+".").padEnd(4)
      + pctLabel.padEnd(14)
      + dVal.padEnd(14)
      + fVal.padEnd(14)
      + result.trim() + "\n";
  });

  const unitLine   = deduct > 0 ? `Unit deductions: -${deduct} pts\nAdjusted Score:  ${adjTotal} / 100\n` : "";
  const ps         = (sub.psGrade     !== undefined && sub.psGrade     !== "") ? parseFloat(sub.psGrade)     : null;
  const sketch     = (sub.sketchGrade !== undefined && sub.sketchGrade !== "") ? parseFloat(sub.sketchGrade) : null;
  const graph      = (sub.graphGrade  !== undefined && sub.graphGrade  !== "") ? parseFloat(sub.graphGrade)  : null;
  const psStr      = ps     !== null ? String(ps)     : "__";
  const sketchStr  = sketch !== null ? String(sketch) : "__";
  const graphStr   = graph  !== null ? String(graph)  : "__";
  const puTotal    = ps !== null ? String(Math.round((storedFacts + ps) * 100) / 100) : "__";

  const body =
`Dear Parent/Guardian,

${sub.name} has completed Saxon Math Course 2 — Cumulative Test 17A.

${"=".repeat(54)}
TEST QUESTIONS (Q1–Q20)
${"=".repeat(54)}
Score: ${adjTotal} / 100  (${storedPct}% before unit adjustments)
${unitLine}
${questionLines}
${"=".repeat(54)}
POWER UP (graded out of 10)
${"=".repeat(54)}
Facts:            ${storedFacts} / 5  (${storedFactsCorrect}/24 correct)
Problem Solving:  ${psStr} / 5  (teacher graded)
TOTAL POWER UP:   ${storedFacts} + ${psStr} = ${puTotal} / 10

FACTS DETAIL (Percent → Decimal & Fraction):
${factsTable}
PROBLEM SOLVING (teacher graded, 5 pts total):
  Understand (1 pt):  ${sub.data.pu_understand||"--"}
  Plan       (1 pt):  ${sub.data.pu_plan||"--"}
  Solve      (2 pts): ${sub.data.pu_solve||"--"}
  Check      (1 pt):  ${sub.data.pu_check||"--"}

TEACHER-GRADED COMPONENTS:
  Sketch (Q10): ${sketchStr} / 5
  Graph  (Q20): ${graphStr} / 5

${"=".repeat(54)}
Please let me know if you notice any discrepancies so I can review them promptly.

Best regards,
Mrs. West`;

  return { to: emails, subject: `Saxon Math Test 17A Results - ${sub.name}`, body };
}

module.exports = {
  ROSTER,
  ANSWER_KEY, POINTS, SOLUTIONS, FACTS_ANSWERS, FACTS_LABELS,
  ALL_KEYS, QUESTION_TEXT,
  ANSWER_KEY_17, POINTS_17, SOLUTIONS_17, FACTS_ANSWERS_17_MAP, FACTS_KEYS_17, FACTS_LABELS_17,
  ALL_KEYS_17, QUESTION_TEXT_17,
  TEACHER_PASSWORD,
  getEmails, norm,
  gradeData, gradeData17,
  buildEmailBody, buildEmailBody17
};
