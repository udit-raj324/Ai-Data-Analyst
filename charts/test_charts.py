import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt

plt.figure(figsize=(6,4))
plt.plot([1,2,3,4], [10,20,15,30])

plt.title("Test Chart")

plt.savefig("test.png")

plt.close()

print("Chart Saved")