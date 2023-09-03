import { faker } from "@faker-js/faker";
export const fakerListData = () => {
  const a = [];
  for (let i = 0; i < 50000; i++) {
    a.push({
      id: i,
      value: faker.lorem.sentences(),
    });
  }
  return a;
};
