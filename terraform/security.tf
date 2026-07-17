# Security Group

resource "aws_security_group" "app_sg" {

  name = "${var.project_name}-sg"

  description = "Allow SSH and HTTP access"

  vpc_id = data.aws_vpc.default.id


  # SSH access
  ingress {

    description = "SSH access"

    from_port = 22

    to_port = 22

    protocol = "tcp"

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }


  # HTTP access for React + NGINX
  ingress {

    description = "HTTP access"

    from_port = 80

    to_port = 80

    protocol = "tcp"

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }


  # Allow outbound traffic
  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }


  tags = {

    Name = "${var.project_name}-security-group"

  }
}
