import Button from "../../components/Button";

export default function Dashboard() {
  return (
    <div className="text-text">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe voluptate
      fugiat error id voluptatum ut quae. Minus vitae eaque perferendis sequi
      soluta reiciendis exercitationem tempore, saepe in ullam iste harum. Lorem
      ipsum dolor sit amet consectetur adipisicing elit. Saepe voluptate fugiat
      error id voluptatum ut quae. Minus vitae eaque perferendis sequi soluta
      <Button variant="default" size="md">
        Default Button
      </Button>
      <Button variant="outline" size="lg">
        Outline Button
      </Button>
      <Button variant="ghost" size="sm">
        Disabled Ghost Button
      </Button>
    </div>
  );
}
