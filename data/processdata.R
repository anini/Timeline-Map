date <- read.table("data/date.csv", header=TRUE, quote="\"")

pop <- read.csv("data/pop.csv")

population <-merge(date,pop)

write.csv(population, , file="data/population.csv")
