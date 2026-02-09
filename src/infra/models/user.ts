export interface UserCreateProps {
  name: string;
  email: string;
  password: string;
}

export interface UserPersistenceProps extends UserCreateProps {
  id: string;
  createdAt: Date;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class User {
  public readonly id?: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt?: Date;

  private constructor(props: Partial<UserPersistenceProps>) {
    Object.assign(this, props);
  }

  static create(props: UserCreateProps): User {
    return new User(props);
  }

  static restore(props: UserPersistenceProps): User {
    return new User(props);
  }
}
