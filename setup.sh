sudo apt-get update
sudo apt-get install curl
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $(whoami)
rm get-docker.sh
sudo apt-get install docker-compose
sudo systemctl enable docker
# sudo apt-get install bridge-utils
# sudo mkdir -p /etc/systemd/system/docker.service.d
# printf '[Service]\nEnvironment="DOCKER_OPTS=--bridge=docker0 --ip-masq=false --iptables=false"' | sudo tee --append /etc/systemd/system/docker.service.d/bridge.conf
# sudo systemctl daemon-reload
# sudo systemctl restart docker

docker network create -d macvlan -o parent=enp0s3 pub_net

docker run --net=pub_net -it ubuntu /bin/bash

# apt-get update -y
# DEBIAN_FRONTEND=noninteractive apt-get -qq install -y avahi-daemon avahi-utils && apt-get -qq -y autoclean && apt-get -qq -y autoremove && apt-get -qq -y clean
