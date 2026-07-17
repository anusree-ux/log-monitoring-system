# Get default VPC

data "aws_vpc" "default" {
  default = true
}


# Get Ubuntu AMI

data "aws_ami" "ubuntu" {
  most_recent = true
  owners = [
    "099720109477"
  ]


  filter {
    name = "name"
    values = [
      "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
    ]
  }


  filter {
    name = "virtualization-type"
    values = [
      "hvm"
    ]
  }
}

# EC2 Instance
resource "aws_instance" "server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name
  vpc_security_group_ids = [
    aws_security_group.app_sg.id
  ]
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }
  tags = {
    Name = "${var.project_name}-server"
  }
}

# Elastic IP

resource "aws_eip" "server_ip" {
  instance = aws_instance.server.id
  domain   = "vpc"
  tags = {
    Name = "${var.project_name}-elastic-ip"

  }

}
